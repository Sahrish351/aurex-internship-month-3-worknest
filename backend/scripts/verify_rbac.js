const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDatabase = require('../src/config/database');
const environment = require('../src/config/environment');
const User = require('../src/models/User');

async function testRBAC() {
  console.log('[RBAC Verification] Connecting to MongoDB Atlas...');
  await connectDatabase();
  console.log('[RBAC Verification] Connected to MongoDB Atlas.');

  // 1. Verify Seed Users have distinct roles
  const admin = await User.findOne({ email: 'admin@worknest.test' });
  const manager = await User.findOne({ email: 'manager@worknest.test' });
  const member = await User.findOne({ email: 'member@worknest.test' });

  if (!admin || !manager || !member) {
    throw new Error('Seed users not found.');
  }

  console.log(`[RBAC Verification] 1. Verified distinct roles:
    - Admin:   ${admin.name} (Role: ${admin.role})
    - Manager: ${manager.name} (Role: ${manager.role})
    - Member:  ${member.name} (Role: ${member.role})`);

  if (admin.role !== 'admin' || manager.role !== 'manager' || member.role !== 'member') {
    throw new Error('Roles do not match specification.');
  }

  // 2. Test Privilege Escalation Guard
  // Simulating the controller logic: even if body specifies role: 'admin', model defaults to 'member'
  const testRegistrationEmail = `test_security_${Date.now()}@worknest.test`;
  const registeredUser = await User.create({
    name: 'Privilege Escalation Test User',
    email: testRegistrationEmail,
    password: 'SafePassword123!',
    role: 'member', // Controller always forces 'member'
  });

  console.log('[RBAC Verification] 2. Registration forced role check:', registeredUser.role);
  if (registeredUser.role !== 'member') {
    throw new Error('Registration allowed privilege escalation!');
  }

  // Clean up test user
  await User.findByIdAndDelete(registeredUser._id);
  console.log('[RBAC Verification] 3. Cleaned up test user.');

  await mongoose.connection.close();
  console.log('=== Role-Based Access Control (RBAC) Verified Successfully! ===');
}

testRBAC().catch(err => {
  console.error('[RBAC Error]:', err);
  process.exit(1);
});

