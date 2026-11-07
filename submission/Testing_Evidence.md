# WorkNest — Testing Evidence & Postman Execution

## 1. Automated Integration Test Suite
Executed via Jest (v29.7.0) and Supertest (v7.0.0):
- **Command:** `npm test` inside `/backend`
- **Total Test Cases:** 13
- **Passed:** 13 (100%)
- **Failed:** 0 (0%)
- **Status:** PASS

```text
PASS tests/api.test.js
  === WorkNest Backend Core API & Security Test Suite ===
    1. Health Check Endpoint
      √ GET /api/health should return 200 with healthy status (188 ms)
      √ GET /api/non-existent-endpoint should return 404 with error details (34 ms)
    2. Validation Middleware
      √ POST /api/auth/register with missing fields should return 400 validation error (128 ms)
      √ POST /api/auth/login with missing password should return 400 (31 ms)
    3. Cryptography & Password Hashing
      √ bcrypt should securely hash passwords and verify matching passwords (309 ms)
    4. JWT Token Generation & Verification
      √ should generate valid JWT tokens with expected payload (22 ms)
      √ verifyToken should throw error on tampered token (13 ms)
    5. Role-Based Access Control (RBAC) Middleware
      √ authorize middleware should return 403 when user role is not permitted (3 ms)
      √ authorize middleware should call next() when user role matches (1 ms)
    6. Protected Endpoint Verification
      √ GET /api/projects without token should return 401 Unauthorized (38 ms)
      √ GET /api/tasks without token should return 401 Unauthorized (15 ms)
      √ GET /api/notifications without token should return 401 Unauthorized (17 ms)
      √ GET /api/dashboard/stats without token should return 401 Unauthorized (17 ms)
```

---

## 2. Postman Test Collection Evidence
- **Collection File:** `docs/postman/WorkNest_API.postman_collection.json`
- **Schema:** Postman Collection v2.1.0
- **Total Endpoints Tested:** 20 Requests across 7 Feature Folders
- **Dynamic Variable Ingestion:** `authToken` captured automatically on login test scripts and injected into subsequent protected requests.
