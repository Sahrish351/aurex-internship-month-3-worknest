# WorkNest — Testing Evidence & Postman Execution

## 1. Automated Integration Test Suite
Executed via Jest (v29.7.0) and Supertest (v7.0.0):
- **Command:** `npm test` inside `/backend`
- **Total Test Suites:** 2 (Core API & Security Suite + MongoDB End-to-End Integration Suite)
- **Total Test Cases:** 28
- **Passed:** 28 (100%)
- **Failed:** 0 (0%)
- **Database Target:** MongoDB Atlas (`WorkNestCluster`) & Local Mock Verification
- **Status:** PASS

```text
PASS tests/integration.test.js
  [MongoDB Atlas] Successfully connected to host: ac-bo74zcj-shard-00-01.esyud3d.mongodb.net | DB: worknest
  [MongoDB Atlas] Ping response: {"ok":1}
  === WorkNest MongoDB End-to-End Integration Test Suite ===
    1. Registration and Authentication API
      √ should register a new member and reject privilege escalation attempt (210 ms)
      √ should login with the newly created user (165 ms)
      √ should reject login with incorrect credentials (110 ms)
    2. Project Lifecycle & Access Control
      √ member role should be forbidden from creating a project (403) (32 ms)
      √ manager role should successfully create a project (201) (140 ms)
      √ should add a member to the project (65 ms)
      √ should update project details via PUT /api/projects/:id (78 ms)
    3. Task Management & Business Rules
      √ should reject task assignment to a non-project member (400) (95 ms)
      √ should create a valid task assigned to a project member (120 ms)
      √ should update task status via PATCH /api/tasks/:id/status (Kanban drag-and-drop) (85 ms)
    4. Comment Lifecycle & Authorization
      √ should add a comment to a task (POST /api/tasks/:id/comments) (80 ms)
      √ should allow author to edit comment (PUT /api/comments/:id) (75 ms)
      √ should forbid non-author member from editing someone else comment (403) (30 ms)
    5. Notifications and Dashboard Stats
      √ GET /api/notifications should return list and unread count (45 ms)
      √ GET /api/dashboard/stats should return dynamic role stats (60 ms)

PASS tests/api.test.js
  === WorkNest Backend Core API & Security Test Suite ===
    1. Health Check Endpoint
      √ GET /api/health should return 200 with healthy status (171 ms)
      √ GET /api/non-existent-endpoint should return 404 with error details (20 ms)
    2. Validation Middleware
      √ POST /api/auth/register with missing fields should return 400 validation error (134 ms)
      √ POST /api/auth/login with missing password should return 400 (27 ms)
    3. Cryptography & Password Hashing
      √ bcrypt should securely hash passwords and verify matching passwords (279 ms)
    4. JWT Token Generation & Verification
      √ should generate valid JWT tokens with expected payload (5 ms)
      √ verifyToken should throw error on tampered token (12 ms)
    5. Role-Based Access Control (RBAC) Middleware
      √ authorize middleware should return 403 when user role is not permitted (4 ms)
      √ authorize middleware should call next() when user role matches (2 ms)
    6. Protected Endpoint Verification
      √ GET /api/projects without token should return 401 Unauthorized (18 ms)
      √ GET /api/tasks without token should return 401 Unauthorized (15 ms)
      √ GET /api/notifications without token should return 401 Unauthorized (13 ms)
      √ GET /api/dashboard/stats without token should return 401 Unauthorized (27 ms)

Test Suites: 2 passed, 2 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        15.757 s
```

---

## 2. Postman Test Collection Evidence
- **Collection File:** `docs/postman/WorkNest_API.postman_collection.json`
- **Schema:** Postman Collection v2.1.0
- **Total Endpoints Tested:** 21 Requests across 8 Feature Folders (including Comment Editing `PUT /api/comments/:id` and Project Editing `PUT /api/projects/:id`)
- **Dynamic Variable Ingestion:** `authToken` captured automatically on login test scripts and injected into subsequent protected requests.
