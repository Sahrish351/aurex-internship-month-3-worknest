const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');
const sendNotification = require('../utils/notifier');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Manager, Admin
const createProject = async (req, res, next) => {
  try {
    const { title, description, priority, status, startDate, dueDate, members = [] } = req.body;

    // Ensure owner is included in members
    const memberIds = new Set(members.map((id) => id.toString()));
    memberIds.add(req.user._id.toString());

    const project = await Project.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Planning',
      startDate: startDate || Date.now(),
      dueDate,
      owner: req.user._id,
      members: Array.from(memberIds),
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    await logActivity({
      actor: req.user._id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project._id,
      details: `${req.user.name} created project "${project.title}"`,
    });

    // Notify initial members (excluding creator)
    for (const memberId of members) {
      if (memberId.toString() !== req.user._id.toString()) {
        await sendNotification({
          recipient: memberId,
          title: 'Added to Project',
          message: `You were added to project "${project.title}" by ${req.user.name}.`,
          type: 'PROJECT_INVITE',
          link: `/projects/${project._id}`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: populatedProject },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all accessible projects
// @route   GET /api/projects
// @access  Authenticated
const getAllProjects = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};

    // RBAC Scope: Admin sees all; others see projects they own or belong to
    if (req.user.role !== 'admin') {
      query.$or = [{ owner: req.user._id }, { members: req.user._id }];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Attach task progress metrics
    const projectIds = projects.map((p) => p._id);
    const taskStats = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const statsMap = {};
    taskStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        total: stat.totalTasks,
        completed: stat.completedTasks,
        progress: stat.totalTasks > 0 ? Math.round((stat.completedTasks / stat.totalTasks) * 100) : 0,
      };
    });

    const projectsWithProgress = projects.map((p) => {
      const stats = statsMap[p._id.toString()] || { total: 0, completed: 0, progress: 0 };
      return {
        ...p.toObject(),
        taskStats: stats,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        projects: projectsWithProgress,
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

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Authenticated (Member, Owner, Admin)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found.' },
      });
    }

    // Access check
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. You do not have permission to view this project.' },
      });
    }

    // Fetch tasks for this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        project: {
          ...project.toObject(),
          tasks,
          taskStats: { total: totalTasks, completed: completedTasks, progress },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Authenticated (Owner, Admin)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found.' },
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the project owner or an administrator can update this project.' },
      });
    }

    const { title, description, priority, status, startDate, dueDate } = req.body;
    if (title) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (priority) project.priority = priority;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (dueDate) project.dueDate = dueDate;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    await logActivity({
      actor: req.user._id,
      action: 'PROJECT_UPDATED',
      entityType: 'Project',
      entityId: project._id,
      details: `${req.user.name} updated project details for "${project.title}"`,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Authenticated (Owner, Admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found.' },
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the project owner or an administrator can delete this project.' },
      });
    }

    // Cascade delete: tasks and comments belonging to tasks
    const tasks = await Task.find({ project: project._id });
    const taskIds = tasks.map((t) => t._id);
    await Comment.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    await logActivity({
      actor: req.user._id,
      action: 'PROJECT_DELETED',
      entityType: 'Project',
      entityId: project._id,
      details: `${req.user.name} deleted project "${project.title}" and associated tasks`,
    });

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Authenticated (Owner, Admin, Manager)
const addProjectMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required to add a member.' },
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found.' },
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only project owner or administrator can add members.' },
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'User to add was not found.' },
      });
    }

    if (project.members.map((id) => id.toString()).includes(userId.toString())) {
      return res.status(400).json({
        success: false,
        error: { message: 'User is already a member of this project.' },
      });
    }

    project.members.push(userId);
    await project.save();

    await logActivity({
      actor: req.user._id,
      action: 'MEMBER_ADDED',
      entityType: 'Project',
      entityId: project._id,
      details: `${req.user.name} added ${targetUser.name} to project "${project.title}"`,
    });

    await sendNotification({
      recipient: targetUser._id,
      title: 'Added to Project',
      message: `You were added to project "${project.title}" by ${req.user.name}.`,
      type: 'PROJECT_INVITE',
      link: `/projects/${project._id}`,
    });

    const populated = await Project.findById(project._id).populate('members', 'name email avatar role');

    res.status(200).json({
      success: true,
      message: `${targetUser.name} added to project`,
      data: { members: populated.members },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Authenticated (Owner, Admin)
const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found.' },
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only project owner or administrator can remove members.' },
      });
    }

    if (project.owner.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot remove the project owner from members.' },
      });
    }

    project.members = project.members.filter((m) => m.toString() !== userId.toString());
    await project.save();

    // Unassign tasks assigned to this removed member in this project
    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { $set: { assignedTo: null } }
    );

    await logActivity({
      actor: req.user._id,
      action: 'MEMBER_REMOVED',
      entityType: 'Project',
      entityId: project._id,
      details: `${req.user.name} removed a member from project "${project.title}"`,
    });

    const populated = await Project.findById(project._id).populate('members', 'name email avatar role');

    res.status(200).json({
      success: true,
      message: 'Member removed from project',
      data: { members: populated.members },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};
