const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const logActivity = require('../utils/activityLogger');
const sendNotification = require('../utils/notifier');

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Authenticated
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment text is required.' },
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    const comment = await Comment.create({
      task: task._id,
      author: req.user._id,
      text: text.trim(),
    });

    const populated = await Comment.findById(comment._id).populate('author', 'name email avatar role');

    await logActivity({
      actor: req.user._id,
      action: 'COMMENT_ADDED',
      entityType: 'Comment',
      entityId: comment._id,
      details: `${req.user.name} commented on task "${task.title}"`,
    });

    // Notify task assignee if someone else comments
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await sendNotification({
        recipient: task.assignedTo,
        title: 'New Comment on Task',
        message: `${req.user.name} commented on "${task.title}": "${text.substring(0, 50)}..."`,
        type: 'COMMENT_ADDED',
        link: `/projects/${task.project}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: { comment: populated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a task
// @route   GET /api/tasks/:id/comments
// @access  Authenticated
const getTaskComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('author', 'name email avatar role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / edit comment
// @route   PUT /api/comments/:id
// @access  Authenticated (Author or Admin)
const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment text is required.' },
      });
    }

    if (text.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment cannot exceed 2000 characters.' },
      });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found.' },
      });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. You can only edit your own comments.' },
      });
    }

    comment.text = text.trim();
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('author', 'name email avatar role');

    await logActivity({
      actor: req.user._id,
      action: 'COMMENT_UPDATED',
      entityType: 'Comment',
      entityId: comment._id,
      details: `${req.user.name} updated comment on task`,
    });

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment: populated },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Authenticated (Author or Admin)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Comment not found.' },
      });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. You can only delete your own comments.' },
      });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
};
