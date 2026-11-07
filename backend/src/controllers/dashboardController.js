const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get dynamic role-specific dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Authenticated
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const now = new Date();

    let stats = {};

    if (role === 'admin') {
      // 1. Admin Global Stats
      const [
        totalUsers,
        activeUsers,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        Project.countDocuments(),
        Project.countDocuments({ status: 'Active' }),
        Project.countDocuments({ status: 'Completed' }),
        Task.countDocuments(),
        Task.countDocuments({ status: 'Completed' }),
      ]);

      stats = {
        role: 'admin',
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
      };
    } else if (role === 'manager') {
      // 2. Project Manager Stats (Projects owned or managed)
      const managedProjects = await Project.find({ owner: userId });
      const projectIds = managedProjects.map((p) => p._id);

      const [
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
      ] = await Promise.all([
        Project.countDocuments({ owner: userId }),
        Project.countDocuments({ owner: userId, status: 'Active' }),
        Project.countDocuments({ owner: userId, status: 'Completed' }),
        Task.countDocuments({ project: { $in: projectIds } }),
        Task.countDocuments({ project: { $in: projectIds }, status: 'Completed' }),
        Task.countDocuments({
          project: { $in: projectIds },
          status: { $ne: 'Completed' },
          dueDate: { $lt: now },
        }),
      ]);

      // Unique team members across manager projects
      const memberSet = new Set();
      managedProjects.forEach((p) => {
        p.members.forEach((m) => memberSet.add(m.toString()));
      });

      stats = {
        role: 'manager',
        overview: {
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          overdueTasks,
          teamMembersCount: memberSet.size,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
      };
    } else {
      // 3. Team Member Stats (Personal Tasks & Participated Projects)
      const [
        assignedTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        participatingProjects,
      ] = await Promise.all([
        Task.countDocuments({ assignedTo: userId }),
        Task.countDocuments({ assignedTo: userId, status: 'Completed' }),
        Task.countDocuments({ assignedTo: userId, status: 'In Progress' }),
        Task.countDocuments({
          assignedTo: userId,
          status: { $ne: 'Completed' },
          dueDate: { $lt: now },
        }),
        Project.countDocuments({ members: userId }),
      ]);

      stats = {
        role: 'member',
        overview: {
          assignedTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks: assignedTasks - completedTasks,
          overdueTasks,
          participatingProjects,
          completionRate: assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0,
        },
      };
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's assigned tasks
// @route   GET /api/dashboard/my-tasks
// @access  Authenticated
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title status priority')
      .populate('createdBy', 'name email avatar')
      .sort({ dueDate: 1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getMyTasks,
};
