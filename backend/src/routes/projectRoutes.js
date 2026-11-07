const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require('../controllers/projectController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validateRequired } = require('../middleware/validateRequest');

router.use(authenticate);

// Create project: Manager or Admin
router.post(
  '/',
  authorize('manager', 'admin'),
  validateRequired(['title', 'description', 'dueDate']),
  createProject
);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Member management
router.post('/:id/members', validateRequired(['userId']), addProjectMember);
router.delete('/:id/members/:userId', removeProjectMember);

module.exports = router;
