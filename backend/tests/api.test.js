const request = require('supertest');
const app = require('../src/app');
const { generateToken, verifyToken } = require('../src/utils/token');
const authenticate = require('../src/middleware/authenticate');
const authorize = require('../src/middleware/authorize');
const { validateRequired } = require('../src/middleware/validateRequest');
const bcrypt = require('bcryptjs');

describe('=== WorkNest Backend Core API & Security Test Suite ===', () => {
  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return 200 with healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('WorkNest REST API');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('GET /api/non-existent-endpoint should return 404 with error details', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });

  describe('2. Validation Middleware', () => {
    it('POST /api/auth/register with missing fields should return 400 validation error', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' }); // Missing name and password

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Missing required field');
    });

    it('POST /api/auth/login with missing password should return 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Cryptography & Password Hashing', () => {
    it('bcrypt should securely hash passwords and verify matching passwords', async () => {
      const plainPassword = 'SuperSecretPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(plainPassword, salt);

      expect(hash).not.toBe(plainPassword);
      expect(hash.startsWith('$2')).toBe(true);

      const isMatch = await bcrypt.compare(plainPassword, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await bcrypt.compare('WrongPassword456', hash);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('4. JWT Token Generation & Verification', () => {
    it('should generate valid JWT tokens with expected payload', () => {
      const payload = { id: '673f1234567890abcdef1234', role: 'manager', email: 'manager@worknest.test' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.email).toBe(payload.email);
    });

    it('verifyToken should throw error on tampered token', () => {
      const payload = { id: '123', role: 'member' };
      const token = generateToken(payload);
      const tampered = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyToken(tampered)).toThrow();
    });
  });

  describe('5. Role-Based Access Control (RBAC) Middleware', () => {
    it('authorize middleware should return 403 when user role is not permitted', () => {
      const req = { user: { role: 'member', name: 'Member User' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const managerGuard = authorize('manager', 'admin');
      managerGuard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: expect.stringContaining('Forbidden'),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('authorize middleware should call next() when user role matches', () => {
      const req = { user: { role: 'admin', name: 'Admin User' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      const adminGuard = authorize('admin');
      adminGuard(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('6. Protected Endpoint Verification', () => {
    it('GET /api/projects without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Authentication required');
    });

    it('GET /api/tasks without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Authentication required');
    });

    it('GET /api/notifications without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/notifications');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Authentication required');
    });

    it('GET /api/dashboard/stats without token should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Authentication required');
    });
  });
});
