const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

// @desc    Get all users (with search and filtering)
// @route   GET /api/users
// @access  Authenticated
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        users,
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

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Authenticated
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found.' },
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (Self)
// @route   PATCH /api/users/profile
// @access  Authenticated
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    await logActivity({
      actor: user._id,
      action: 'PROFILE_UPDATED',
      entityType: 'User',
      entityId: user._id,
      details: `${user.name} updated their profile information`,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id/role
// @access  Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'manager', 'member'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role specified.' },
      });
    }

    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: { message: 'Administrators cannot demote their own role.' },
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found.' },
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logActivity({
      actor: req.user._id,
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: user._id,
      details: `Admin ${req.user.name} updated ${user.name}'s role from ${oldRole} to ${role}`,
    });

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Admin only)
// @route   PATCH /api/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid status specified.' },
      });
    }

    if (req.user._id.toString() === req.params.id && status === 'inactive') {
      return res.status(400).json({
        success: false,
        error: { message: 'Administrators cannot deactivate their own account.' },
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found.' },
      });
    }

    user.status = status;
    await user.save();

    await logActivity({
      actor: req.user._id,
      action: 'USER_STATUS_CHANGED',
      entityType: 'User',
      entityId: user._id,
      details: `Admin ${req.user.name} set account status of ${user.name} to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: `User account is now ${status}`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  updateUserStatus,
};
