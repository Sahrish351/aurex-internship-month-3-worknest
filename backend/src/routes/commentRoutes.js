const express = require('express');
const router = express.Router();
const { deleteComment } = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.delete('/:id', deleteComment);

module.exports = router;
