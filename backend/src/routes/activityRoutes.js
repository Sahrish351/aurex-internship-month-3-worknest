const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../controllers/activityController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', getRecentActivities);

module.exports = router;
