const ActivityLog = require('../models/ActivityLog');

// @desc    Get recent activity audit trail
// @route   GET /api/activity
// @access  Authenticated
const getRecentActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const activities = await ActivityLog.find()
      .populate('actor', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecentActivities,
};
