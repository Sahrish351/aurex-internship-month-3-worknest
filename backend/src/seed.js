const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Comment = require('./models/Comment');
const Notification = require('./models/Notification');
const ActivityLog = require('./models/ActivityLog');
const connectDatabase = require('./config/database');

const seedData = async () => {
  try {
    await connectDatabase();
    console.log('[Seed] Connected to database. Clearing existing data...');

    // Clear existing collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('[Seed] Creating demo users...');
    // Create users (pre-save hook hashes passwords)
    const adminUser = await User.create({
      name: 'Eleanor Vance (Admin)',
      email: 'admin@worknest.test',
      password: 'AdminPassword123!',
      role: 'admin',
      status: 'active',
    });

    const managerUser = await User.create({
      name: 'Marcus Holloway (Manager)',
      email: 'manager@worknest.test',
      password: 'ManagerPassword123!',
      role: 'manager',
      status: 'active',
    });

    const memberUser = await User.create({
      name: 'Sahrish Khan (Engineer)',
      email: 'member@worknest.test',
      password: 'MemberPassword123!',
      role: 'member',
      status: 'active',
    });

    const memberUser2 = await User.create({
      name: 'Julian Sterling (Designer)',
      email: 'julian@worknest.test',
      password: 'MemberPassword123!',
      role: 'member',
      status: 'active',
    });

    console.log('[Seed] Creating demo projects...');
    // Create Project 1
    const project1 = await Project.create({
      title: 'AUREX SaaS Platform Architecture',
      description: 'End-to-end full-stack web application development for enterprise team collaboration.',
      owner: managerUser._id,
      members: [managerUser._id, memberUser._id, memberUser2._id, adminUser._id],
      status: 'Active',
      priority: 'High',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    });

    // Create Project 2
    const project2 = await Project.create({
      title: 'Mobile App Navigation & UI Audit',
      description: 'Responsive design audit and accessible navigation components testing across mobile viewports.',
      owner: managerUser._id,
      members: [managerUser._id, memberUser._id],
      status: 'Planning',
      priority: 'Medium',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating demo tasks...');
    // Create Tasks for Project 1
    const task1 = await Task.create({
      title: 'Design System Architecture & Entity Blueprint',
      description: 'Construct multi-entity schema models in Mongoose with referential integrity constraints.',
      project: project1._id,
      assignedTo: memberUser._id,
      createdBy: managerUser._id,
      status: 'Completed',
      priority: 'High',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    const task2 = await Task.create({
      title: 'Implement JWT Authentication & RBAC Middleware',
      description: 'Enforce bcrypt password hashing, token validation, and role authorization guards.',
      project: project1._id,
      assignedTo: memberUser._id,
      createdBy: managerUser._id,
      status: 'In Progress',
      priority: 'Urgent',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    const task3 = await Task.create({
      title: 'Sprint Kanban Board Component & Drag-and-Drop',
      description: 'Build responsive drag-and-drop board with optimistic UI updates and backend synchronization.',
      project: project1._id,
      assignedTo: memberUser2._id,
      createdBy: managerUser._id,
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    });

    const task4 = await Task.create({
      title: 'Execute Automated Jest & Supertest API Verification',
      description: 'Run integration test suite covering status codes, validation, and role permissions.',
      project: project1._id,
      assignedTo: memberUser._id,
      createdBy: adminUser._id,
      status: 'In Review',
      priority: 'High',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating demo comments...');
    // Add Comments
    await Comment.create({
      task: task2._id,
      author: memberUser._id,
      text: 'Bcrypt salt rounds set to 10; JWT signing verified against Supertest integration test suite.',
    });

    await Comment.create({
      task: task2._id,
      author: managerUser._id,
      text: 'Excellent work. Ensure the public register endpoint strictly ignores client-supplied roles.',
    });

    console.log('[Seed] Creating demo notifications...');
    // Add Notifications
    await Notification.create({
      recipient: memberUser._id,
      title: 'New Task Assigned',
      message: `${managerUser.name} assigned you the task "${task2.title}".`,
      type: 'TASK_ASSIGNED',
      link: `/projects/${project1._id}`,
      isRead: false,
    });

    await Notification.create({
      recipient: memberUser._id,
      title: 'Project Invitation',
      message: `You were added to project "${project1.title}" as an active collaborator.`,
      type: 'PROJECT_INVITE',
      link: `/projects/${project1._id}`,
      isRead: true,
    });

    console.log('[Seed] Creating demo activity logs...');
    // Add Activity Logs
    await ActivityLog.create({
      actor: managerUser._id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project1._id,
      details: `${managerUser.name} created project "${project1.title}"`,
    });

    await ActivityLog.create({
      actor: managerUser._id,
      action: 'TASK_ASSIGNED',
      entityType: 'Task',
      entityId: task2._id,
      details: `${managerUser.name} assigned "${task2.title}" to ${memberUser.name}`,
    });

    await ActivityLog.create({
      actor: memberUser._id,
      action: 'TASK_STATUS_CHANGED',
      entityType: 'Task',
      entityId: task1._id,
      details: `${memberUser.name} moved task "${task1.title}" to Completed`,
    });

    console.log('===========================================================');
    console.log(' WorkNest Demo Database Successfully Seeded!');
    console.log(' Demo Accounts Created:');
    console.log('   Admin:   admin@worknest.test   / AdminPassword123!');
    console.log('   Manager: manager@worknest.test / ManagerPassword123!');
    console.log('   Member:  member@worknest.test  / MemberPassword123!');
    console.log('===========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Error]: ${err.message}`);
    process.exit(1);
  }
};

seedData();
