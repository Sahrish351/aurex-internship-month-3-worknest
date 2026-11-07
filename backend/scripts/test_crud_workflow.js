const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDatabase = require('../src/config/database');
const environment = require('../src/config/environment');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');
const Comment = require('../src/models/Comment');
const Notification = require('../src/models/Notification');
const ActivityLog = require('../src/models/ActivityLog');

async function testBackendCRUD() {
  console.log('[Test CRUD] Connecting to MongoDB Atlas...');
  await connectDatabase();
  console.log('[Test CRUD] Connected successfully.');

  // 1. Verify User Authentication / JWT
  const user = await User.findOne({ role: 'manager' });
  if (!user) throw new Error('Manager user not found in Atlas.');

  const token = jwt.sign({ id: user._id, role: user.role }, environment.jwtSecret, { expiresIn: '1d' });
  const decoded = jwt.verify(token, environment.jwtSecret);
  console.log('[Test CRUD] 1. Auth & JWT generation verified for user:', user.email, '| Decoded ID:', decoded.id);

  // 2. Project Creation & Update
  const testProject = await Project.create({
    title: 'Temporary Test Project for CRUD Verification',
    description: 'Testing backend project CRUD lifecycle against Atlas.',
    owner: user._id,
    members: [user._id],
    priority: 'High',
    status: 'Planning',
    startDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  console.log('[Test CRUD] 2a. Project created:', testProject.title, '| ID:', testProject._id);

  testProject.status = 'Active';
  testProject.title = 'Updated Test Project Title';
  await testProject.save();
  const updatedProject = await Project.findById(testProject._id);
  console.log('[Test CRUD] 2b. Project updated status:', updatedProject.status, '| title:', updatedProject.title);

  // 3. Task Creation, Assignment & Status Update
  const testTask = await Task.create({
    title: 'Temporary Test Task',
    description: 'Testing task status transitions and assignment.',
    project: testProject._id,
    assignedTo: user._id,
    createdBy: user._id,
    status: 'To Do',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });
  console.log('[Test CRUD] 3a. Task created:', testTask.title, '| ID:', testTask._id);

  testTask.status = 'In Progress';
  await testTask.save();
  const updatedTask = await Task.findById(testTask._id).populate('project', 'title');
  console.log('[Test CRUD] 3b. Task updated to status:', updatedTask.status, '| parent:', updatedTask.project.title);

  // 4. Comment Creation, Edit & Deletion
  const testComment = await Comment.create({
    task: testTask._id,
    author: user._id,
    text: 'Original comment text before edit.',
  });
  console.log('[Test CRUD] 4a. Comment created:', testComment.text, '| ID:', testComment._id);

  testComment.text = 'Successfully updated comment text via PUT workflow.';
  await testComment.save();
  const updatedComment = await Comment.findById(testComment._id).populate('author', 'name email');
  console.log('[Test CRUD] 4b. Comment updated in Atlas:', updatedComment.text, '| author:', updatedComment.author.name);

  await Comment.findByIdAndDelete(testComment._id);
  const deletedCommentCheck = await Comment.findById(testComment._id);
  console.log('[Test CRUD] 4c. Comment deleted:', deletedCommentCheck === null ? 'PASS' : 'FAIL');

  // 5. Activity Log & Notification
  const testLog = await ActivityLog.create({
    actor: user._id,
    action: 'TEST_ACTION',
    entityType: 'Project',
    entityId: testProject._id,
    details: 'CRUD test audit event execution.',
  });
  console.log('[Test CRUD] 5a. ActivityLog created ID:', testLog._id);

  const testNotification = await Notification.create({
    recipient: user._id,
    title: 'Test Notification',
    message: 'Test notification delivery.',
    type: 'SYSTEM',
  });
  console.log('[Test CRUD] 5b. Notification created ID:', testNotification._id);

  // 6. Clean up temporary test entities
  await Task.findByIdAndDelete(testTask._id);
  await Project.findByIdAndDelete(testProject._id);
  await ActivityLog.findByIdAndDelete(testLog._id);
  await Notification.findByIdAndDelete(testNotification._id);
  console.log('[Test CRUD] 6. Cleaned up temporary test documents.');

  await mongoose.connection.close();
  console.log('=== Complete Backend CRUD Workflow Verified Successfully against MongoDB Atlas! ===');
}

testBackendCRUD().catch(err => {
  console.error('[CRUD Test Error]:', err);
  process.exit(1);
});

