const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const logActivity = require('../utils/activityLogger');
const sendNotification = require('../utils/notifier');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Authenticated
const createTask = async (req, res, next) => {
  try {
    const { title, description, project: projectId, assignedTo, priority, status, dueDate } = req.body;

    // Verify parent project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Parent project not found.' },
      });
    }

    // Access check: User must be member or owner of the project (or admin)
    const isMember = project.members.some((m) => m.toString() === req.user._id.toString());
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'You must be a member or manager of this project to create tasks.' },
      });
    }

    // Business rule: Assigned user MUST be a project member or owner
    if (assignedTo) {
      const isAssigneeValid =
        project.members.some((m) => m.toString() === assignedTo.toString()) ||
        project.owner.toString() === assignedTo.toString();

      if (!isAssigneeValid) {
        return res.status(400).json({
          success: false,
          error: { message: 'Assigned user is not a member of this project.' },
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      project: project._id,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title');

    await logActivity({
      actor: req.user._id,
      action: 'TASK_CREATED',
      entityType: 'Task',
      entityId: task._id,
      details: `${req.user.name} created task "${task.title}" in project "${project.title}"`,
    });

    // Notify assignee if assigned to someone else
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await sendNotification({
        recipient: assignedTo,
        title: 'New Task Assigned',
        message: `${req.user.name} assigned you the task "${task.title}".`,
        type: 'TASK_ASSIGNED',
        link: `/projects/${project._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: populated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Authenticated
const getAllTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignedTo, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task details with comments
// @route   GET /api/tasks/:id
// @access  Authenticated
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate({
        path: 'project',
        select: 'title description owner members status priority',
        populate: { path: 'owner', select: 'name email' },
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    const comments = await Comment.find({ task: task._id })
      .populate('author', 'name email avatar role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        task: {
          ...task.toObject(),
          comments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Authenticated
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    const project = await Project.findById(task.project);
    const isMember = project && project.members.some((m) => m.toString() === req.user._id.toString());
    const isOwner = project && project.owner.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isOwner && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'You are not authorized to update this task.' },
      });
    }

    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    // Validate assignee if changed
    if (assignedTo && assignedTo.toString() !== (task.assignedTo ? task.assignedTo.toString() : '')) {
      const isAssigneeValid =
        project.members.some((m) => m.toString() === assignedTo.toString()) ||
        project.owner.toString() === assignedTo.toString();

      if (!isAssigneeValid) {
        return res.status(400).json({
          success: false,
          error: { message: 'Assigned user is not a member of this project.' },
        });
      }

      // Notify new assignee
      if (assignedTo.toString() !== req.user._id.toString()) {
        await sendNotification({
          recipient: assignedTo,
          title: 'Task Assigned',
          message: `${req.user.name} assigned you the task "${title || task.title}".`,
          type: 'TASK_ASSIGNED',
          link: `/projects/${project._id}`,
        });
      }
    }

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    const updated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title');

    await logActivity({
      actor: req.user._id,
      action: 'TASK_UPDATED',
      entityType: 'Task',
      entityId: task._id,
      details: `${req.user.name} updated task "${task.title}"`,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (Kanban drag-and-drop)
// @route   PATCH /api/tasks/:id/status
// @access  Authenticated
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['To Do', 'In Progress', 'In Review', 'Completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    const updated = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title owner');

    await logActivity({
      actor: req.user._id,
      action: 'TASK_STATUS_CHANGED',
      entityType: 'Task',
      entityId: task._id,
      details: `${req.user.name} moved task "${task.title}" from "${oldStatus}" to "${status}"`,
    });

    // Notify task creator and assignee if status changed by another team member
    const notifyTargets = new Set();
    if (task.createdBy.toString() !== req.user._id.toString()) {
      notifyTargets.add(task.createdBy.toString());
    }
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      notifyTargets.add(task.assignedTo.toString());
    }

    for (const recipient of notifyTargets) {
      await sendNotification({
        recipient,
        title: 'Task Status Updated',
        message: `${req.user.name} moved task "${task.title}" to ${status}.`,
        type: 'STATUS_CHANGED',
        link: `/projects/${task.project}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Task status updated to ${status}`,
      data: { task: updated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Authenticated
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    const project = await Project.findById(task.project);
    const isOwner = project && project.owner.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. Only the project owner, task creator, or administrator can delete this task.' },
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ task: task._id });
    await Task.findByIdAndDelete(task._id);

    await logActivity({
      actor: req.user._id,
      action: 'TASK_DELETED',
      entityType: 'Task',
      entityId: task._id,
      details: `${req.user.name} deleted task "${task.title}"`,
    });

    res.status(200).json({
      success: true,
      message: 'Task and associated comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
