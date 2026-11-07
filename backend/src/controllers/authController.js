const User = require('../models/User');
const { generateToken, getCookieOptions } = require('../utils/token');
const logActivity = require('../utils/activityLogger');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide name, email, and password.' },
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with this email address already exists.' },
      });
    }

    // Security check: NEVER allow self-assignment of admin or manager via register payload
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'member', // Default safe role
      status: 'active',
    });

    const token = generateToken({ id: user._id, role: user.role, email: user.email });
    res.cookie('token', token, getCookieOptions());

    await logActivity({
      actor: user._id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id,
      details: `${user.name} registered for a WorkNest account`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide both email and password.' },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' },
      });
    }

    if (user.status === 'inactive') {
      return res.status(401).json({
        success: false,
        error: { message: 'Account is deactivated. Please contact an administrator.' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password.' },
      });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });
    res.cookie('token', token, getCookieOptions());

    await logActivity({
      actor: user._id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user._id,
      details: `${user.name} signed into WorkNest`,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Authenticated
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Authenticated
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PATCH /api/auth/change-password
// @access  Authenticated
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide both current and new passwords.' },
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'New password must be at least 6 characters long.' },
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Current password is incorrect.' },
      });
    }

    user.password = newPassword;
    await user.save();

    await logActivity({
      actor: user._id,
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: user._id,
      details: `${user.name} changed their password`,
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
};
