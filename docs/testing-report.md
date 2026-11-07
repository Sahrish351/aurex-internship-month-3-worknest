# WorkNest — Automated & Functional Testing Report

## 1. Executive Testing Summary
- **Target Application:** WorkNest — Team Project & Task Management Platform
- **Test Framework:** Jest (v29.7.0) + Supertest (v7.0.0)
- **API Test Suite:** `backend/tests/api.test.js`
- **Total Automated Test Cases:** 13
- **Passed:** 13 (100%)
- **Failed:** 0 (0%)
- **Test Execution Time:** 4.953s
- **Postman Test Collection:** `docs/postman/WorkNest_API.postman_collection.json` (7 Modules, 20 Requests)

---

## 2. Automated Test Execution Evidence

```text
PASS tests/api.test.js
  === WorkNest Backend Core API & Security Test Suite ===
    1. Health Check Endpoint
      ✓ GET /api/health should return 200 with healthy status (188 ms)
      ✓ GET /api/non-existent-endpoint should return 404 with error details (34 ms)
    2. Validation Middleware
      ✓ POST /api/auth/register with missing fields should return 400 validation error (128 ms)
      ✓ POST /api/auth/login with missing password should return 400 (31 ms)
    3. Cryptography & Password Hashing
      ✓ bcrypt should securely hash passwords and verify matching passwords (309 ms)
    4. JWT Token Generation & Verification
      ✓ should generate valid JWT tokens with expected payload (22 ms)
      ✓ verifyToken should throw error on tampered token (13 ms)
    5. Role-Based Access Control (RBAC) Middleware
      ✓ authorize middleware should return 403 when user role is not permitted (3 ms)
      ✓ authorize middleware should call next() when user role matches (1 ms)
    6. Protected Endpoint Verification
      ✓ GET /api/projects without token should return 401 Unauthorized (38 ms)
      ✓ GET /api/tasks without token should return 401 Unauthorized (15 ms)
      ✓ GET /api/notifications without token should return 401 Unauthorized (17 ms)
      ✓ GET /api/dashboard/stats without token should return 401 Unauthorized (17 ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        4.953 s
Ran all test suites.
```

---

## 3. Manual Functional Verification Matrix

| Area | Feature Verified | Procedure | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Registration | Submitted name, email, password; verified hashed bcrypt storage and default `member` role. | Passed | Verified |
| **Authentication** | Login | Authenticated valid user; received JWT token; stored in auth context. | Passed | Verified |
| **Authentication** | Invalid Login | Attempted login with incorrect password; received 401 Unauthorized toast. | Passed | Verified |
| **Security** | Role Protection | Attempted member access to admin role modification route; received 403 Forbidden. | Passed | Verified |
| **Security** | Self Elevation | Attempted `role: "admin"` payload during public register; backend defaulted role to `member`. | Passed | Verified |
| **Projects** | Project Creation | Created project with title, dates, priority; verified creation in MongoDB. | Passed | Verified |
| **Tasks** | Drag & Drop | Dragged task from `To Do` to `In Progress`; verified PATCH request persisted to database. | Passed | Verified |
| **Collaboration**| Comments | Added comment on task; verified author association and real-time listing. | Passed | Verified |
| **Notifications** | Alerts | Reassigned task; verified internal notification created for new assignee. | Passed | Verified |
| **Dashboard** | Dynamic Metrics | Verified counts for total users, projects, and task completion percentages are dynamic. | Passed | Verified |
| **UI/UX** | Responsive Layout | Tested viewports across mobile (375px), tablet (768px), and desktop (1280px). | Passed | Verified |

---

## 4. Postman API Test Suite Structure
The Postman collection (`WorkNest_API.postman_collection.json`) covers:
1. `0. Health & Diagnostics` (1 request)
2. `1. Authentication` (7 requests covering register, login, me, change-password, logout, and negative tests)
3. `2. Projects` (5 requests covering create, list, filter, update, delete)
4. `3. Tasks & Kanban` (4 requests covering create, filter, patch status, delete)
5. `4. Task Comments` (2 requests covering add, list)
6. `5. Dashboard & Analytics` (3 requests covering stats, my-tasks, activity)
7. `6. Notifications` (2 requests covering list, mark-all-read)
8. `7. User Administration` (1 request covering user governance)
