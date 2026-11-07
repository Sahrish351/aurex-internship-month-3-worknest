const request = require('supertest');
const mongoose = require('mongoose');
const dns = require('dns');
const app = require('../src/app');
const environment = require('../src/config/environment');
const User = require('../src/models/User');
const Project = require('../src/models/Project');
const Task = require('../src/models/Task');
const Comment = require('../src/models/Comment');
const Notification = require('../src/models/Notification');
const ActivityLog = require('../src/models/ActivityLog');

// Ensure SRV records for MongoDB Atlas resolve reliably across local DNS providers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  // Ignore if custom DNS cannot be set
}

describe('=== WorkNest MongoDB End-to-End Integration Test Suite ===', () => {
  let adminToken = '';
  let managerToken = '';
  let memberToken = '';
  let testUser = null;
  let testProject = null;
  let testTask = null;
  let testComment = null;

  beforeAll(async () => {
    // 1. Compute isolated test database URI (strictly 'worknest_test')
    const baseUri = environment.mongodbUri;
    const testDbUri = baseUri.includes('/worknest')
      ? baseUri.replace(/\/worknest(\?|$)/, '/worknest_test$1')
      : baseUri.endsWith('/')
        ? `${baseUri}worknest_test`
        : `${baseUri}/worknest_test`;

    // 2. Disconnect if previously connected to default app database
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // 3. Connect strictly to the isolated test database
    await mongoose.connect(testDbUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    // 4. Strict Safety Assertion: Confirm test database name
    if (mongoose.connection.name !== 'worknest_test') {
      throw new Error(
        `[CRITICAL TEST SAFETY ERROR] Refusing to run tests! Expected database 'worknest_test' but connected to '${mongoose.connection.name}'.`
      );
    }

    console.log(`[Integration Test] Safely connected to ISOLATED test database: [${mongoose.connection.name}]`);

    // 5. Clean up any stale data inside the isolated test database
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});

    // 6. Seed isolated test users for testing
    await User.create({
      name: 'Admin Test User',
      email: 'admin@worknest.test',
      password: 'AdminPassword123!',
      role: 'admin',
      status: 'active',
    });

    await User.create({
      name: 'Manager Test User',
      email: 'manager@worknest.test',
      password: 'ManagerPassword123!',
      role: 'manager',
      status: 'active',
    });

    await User.create({
      name: 'Member Test User',
      email: 'member@worknest.test',
      password: 'MemberPassword123!',
      role: 'member',
      status: 'active',
    });

    // 7. Authenticate to obtain valid test JWT tokens
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@worknest.test', password: 'AdminPassword123!' });
    expect(adminLoginRes.statusCode).toBe(200);
    adminToken = adminLoginRes.body.data.token;

    const managerLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@worknest.test', password: 'ManagerPassword123!' });
    expect(managerLoginRes.statusCode).toBe(200);
    managerToken = managerLoginRes.body.data.token;

    const memberLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@worknest.test', password: 'MemberPassword123!' });
    expect(memberLoginRes.statusCode).toBe(200);
    memberToken = memberLoginRes.body.data.token;
  }, 35000);

  afterAll(async () => {
    // Strict Safety Assertion: Only drop if connected to 'worknest_test'
    if (mongoose.connection.readyState !== 0) {
      if (mongoose.connection.name === 'worknest_test') {
        console.log('[Integration Test] Dropping isolated test database:', mongoose.connection.name);
        await mongoose.connection.dropDatabase();
      } else {
        console.warn('[Integration Test] Skipped dropDatabase: not connected to worknest_test');
      }
      await mongoose.connection.close();
    }
  }, 35000);

  describe('1. Registration and Authentication API', () => {
    it('should register a new member and reject privilege escalation attempt', async () => {
      const uniqueEmail = `integration_tester_${Date.now()}@worknest.test`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test User',
          email: uniqueEmail,
          password: 'Password123!',
          role: 'admin', // Malicious attempt to escalate privileges
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('member'); // Must remain 'member'
      testUser = res.body.data.user;
    });

    it('should login with the newly created user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'Password123!',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Project Lifecycle & Access Control', () => {
    it('member role should be forbidden from creating a project (403)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          title: 'Forbidden Member Project',
          description: 'This should fail with 403',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('manager role should successfully create a project (201)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          title: 'Integration Test Sprint Project',
          description: 'Automated integration test project for AUREX Capstone.',
          priority: 'High',
          status: 'Planning',
          dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.project.title).toBe('Integration Test Sprint Project');
      testProject = res.body.data.project;
    });

    it('should add a member to the project', async () => {
      const res = await request(app)
        .post(`/api/projects/${testProject._id}/members`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ userId: testUser._id });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should update project details via PUT /api/projects/:id', async () => {
      const res = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          title: 'Updated Integration Test Sprint Project',
          status: 'Active',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.project.status).toBe('Active');
      expect(res.body.data.project.title).toBe('Updated Integration Test Sprint Project');
    });
  });

  describe('3. Task Management & Business Rules', () => {
    it('should reject task assignment to a non-project member (400)', async () => {
      // Create a dummy user not in project
      const nonMember = await User.create({
        name: 'Non Member User',
        email: `nonmember_${Date.now()}@worknest.test`,
        password: 'Password123!',
        role: 'member',
      });

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          title: 'Task Assigned to Outsider',
          project: testProject._id,
          assignedTo: nonMember._id,
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      await User.findByIdAndDelete(nonMember._id);

      expect(res.statusCode).toBe(400);
      expect(res.body.error.message).toContain('not a member');
    });

    it('should create a valid task assigned to a project member', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          title: 'Implement Integration Test Coverage',
          description: 'Writing integration tests for Mongoose models and Express routes.',
          project: testProject._id,
          assignedTo: testUser._id,
          priority: 'Urgent',
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.title).toBe('Implement Integration Test Coverage');
      testTask = res.body.data.task;
    });

    it('should update task status via PATCH /api/tasks/:id/status (Kanban drag-and-drop)', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ status: 'In Progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.task.status).toBe('In Progress');
    });
  });

  describe('4. Comment Lifecycle & Authorization', () => {
    it('should add a comment to a task (POST /api/tasks/:id/comments)', async () => {
      const res = await request(app)
        .post(`/api/tasks/${testTask._id}/comments`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ text: 'Starting integration test review now.' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.comment.text).toBe('Starting integration test review now.');
      testComment = res.body.data.comment;
    });

    it('should allow author to edit comment (PUT /api/comments/:id)', async () => {
      const res = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ text: 'Updated comment text by author.' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.comment.text).toBe('Updated comment text by author.');
    });

    it('should forbid non-author member from editing someone else comment (403)', async () => {
      const res = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${memberToken}`) // Member is not the author
        .send({ text: 'Unauthorized edit attempt' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('5. Notifications and Dashboard Stats', () => {
    it('GET /api/notifications should return list and unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('notifications');
      expect(res.body.data).toHaveProperty('unreadCount');
    });

    it('GET /api/dashboard/stats should return dynamic role stats', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe('admin');
      expect(res.body.data.overview).toHaveProperty('totalUsers');
      expect(res.body.data.overview).toHaveProperty('totalProjects');
      expect(res.body.data.overview).toHaveProperty('totalTasks');
    });
  });
});
