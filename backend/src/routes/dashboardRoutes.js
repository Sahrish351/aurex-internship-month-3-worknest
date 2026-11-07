const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMyTasks,
} = require('../controllers/dashboardController');
const { getRecentActivities } = require('../controllers/activityController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/my-tasks', getMyTasks);
router.get('/activity', getRecentActivities);

module.exports = router;
