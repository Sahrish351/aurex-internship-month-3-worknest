const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationRead,
  markAllRead,
} = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', getUserNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllRead);

module.exports = router;
