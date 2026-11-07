const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  updateUserStatus,
} = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validateRequired } = require('../middleware/validateRequest');

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/profile', updateProfile);

// Admin-only operations
router.patch('/:id/role', authorize('admin'), validateRequired(['role']), updateUserRole);
router.patch('/:id/status', authorize('admin'), validateRequired(['status']), updateUserStatus);

module.exports = router;
