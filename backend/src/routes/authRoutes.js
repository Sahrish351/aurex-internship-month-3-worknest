const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
} = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { validateRequired } = require('../middleware/validateRequest');

router.post('/register', validateRequired(['name', 'email', 'password']), register);
router.post('/login', validateRequired(['email', 'password']), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.patch('/change-password', authenticate, validateRequired(['currentPassword', 'newPassword']), changePassword);

module.exports = router;
