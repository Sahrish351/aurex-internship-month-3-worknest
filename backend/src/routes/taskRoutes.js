const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { addComment, getTaskComments } = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');
const { validateRequired } = require('../middleware/validateRequest');

router.use(authenticate);

router.post('/', validateRequired(['title', 'project', 'dueDate']), createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/status', validateRequired(['status']), updateTaskStatus);
router.delete('/:id', deleteTask);

// Nested task comments
router.post('/:id/comments', validateRequired(['text']), addComment);
router.get('/:id/comments', getTaskComments);

module.exports = router;
