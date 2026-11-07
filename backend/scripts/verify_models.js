const mongoose = require('mongoose');
const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');
const Comment = require('../src/models/Comment');
const Notification = require('../src/models/Notification');
const ActivityLog = require('../src/models/ActivityLog');

async function testModels() {
  console.log('[Verification] Connecting to MongoDB Atlas...');
  await connectDatabase();
  console.log('[Verification] Successfully connected. Testing models...');

  // 1. User check
  const usersCount = await User.countDocuments();
  console.log('1. User model count in Atlas:', usersCount);
  if (usersCount < 3) throw new Error('User count failed');

  // 2. Project check with populate
  const projects = await Project.find().populate('owner', 'name email role').populate('members', 'name role');
  console.log('2. Projects count in Atlas:', projects.length, '| Owner populated:', projects[0].owner.name);
  if (!projects[0].owner || !projects[0].owner.name) throw new Error('Project populate failed');

  // 3. Task check with populate
  const tasks = await Task.find().populate('project', 'title').populate('assignedTo', 'name');
  console.log('3. Tasks count in Atlas:', tasks.length, '| Project populated:', tasks[0].project.title);
  if (!tasks[0].project || !tasks[0].project.title) throw new Error('Task populate failed');

  // 4. Comment check with populate
  const comments = await Comment.find().populate('author', 'name').populate('task', 'title');
  console.log('4. Comments count in Atlas:', comments.length, '| Author:', comments[0].author.name);
  if (!comments[0].author || !comments[0].author.name) throw new Error('Comment populate failed');

  // 5. Notification check
  const notifications = await Notification.find().populate('recipient', 'email');
  console.log('5. Notifications count in Atlas:', notifications.length, '| Recipient:', notifications[0].recipient.email);
  if (!notifications[0].recipient || !notifications[0].recipient.email) throw new Error('Notification populate failed');

  // 6. ActivityLog check
  const logs = await ActivityLog.find().populate('actor', 'name');
  console.log('6. ActivityLog count in Atlas:', logs.length, '| Actor:', logs[0].actor.name);
  if (!logs[0].actor || !logs[0].actor.name) throw new Error('ActivityLog populate failed');

  // 7. Test schema validation error rejection
  try {
    await Task.create({ title: '' }); // should fail: missing required fields
    throw new Error('Schema validation failed to reject invalid Task');
  } catch (valErr) {
    const isValError = valErr.name === 'ValidationError';
    console.log('7. Schema validation rejection confirmed:', isValError ? 'PASS' : 'FAIL');
    if (!isValError) throw valErr;
  }

  // 8. Test invalid ObjectId format handling
  try {
    await Project.findById('invalid-mongo-id-12345');
    throw new Error('Expected CastError for invalid ObjectId');
  } catch (castErr) {
    const isCastError = castErr.name === 'CastError';
    console.log('8. Invalid ObjectId handling confirmed:', isCastError ? 'PASS' : 'FAIL');
    if (!isCastError) throw castErr;
  }

  await mongoose.connection.close();
  console.log('=== All 6 Mongoose models and validation rules verified successfully against MongoDB Atlas! ===');
}

testModels().catch(err => {
  console.error('[Verification Failed]:', err);
  process.exit(1);
});
