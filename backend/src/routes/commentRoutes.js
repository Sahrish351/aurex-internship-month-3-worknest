const express = require('express');
const router = express.Router();
const { updateComment, deleteComment } = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
