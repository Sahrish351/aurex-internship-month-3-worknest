# WorkNest — Completed Requirements Checklist

## Project Status: Proposed Project (Pending Mentor Formal Sign-Off)
- **Intern:** Sahrish (`Sahrish351`)
- **Review Date:** November 2026
- **Status Classification:** **Completed**, **Partially Completed**, **Not Completed**, or **Blocked by External Configuration**.

---

## 1. Technical & Architecture Requirements

- [x] **Separation of Concerns:** Client SPA (`frontend/`) and Server REST API (`backend/`) strictly isolated. [Status: Completed]
- [x] **Monorepo Structure:** Clean layout with `/frontend`, `/backend`, `/docs`, `/requirements`, `/submission`. [Status: Completed]
- [x] **Mandatory Tech Stack:** React, Vite, Express, Node.js, MongoDB, Mongoose, JWT, bcrypt. [Status: Completed]
- [x] **Architecture Blueprint:** System diagram and data-flow sequences documented in `docs/architecture.md`. [Status: Completed]
- [x] **Database Schema Modeling:** 6 entities (`User`, `Project`, `Task`, `Comment`, `Notification`, `ActivityLog`) implemented. [Status: Completed]

---

## 2. Authentication & Security Requirements

- [x] **Password Hashing:** Passwords securely hashed with `bcryptjs` (salt rounds: 10) in User schema hooks. [Status: Completed]
- [x] **JWT Token Generation & Verification:** Stateless tokens signed and verified via utility and middleware. [Status: Completed]
- [x] **Role-Based Authorization (RBAC):** Middleware enforcing permissions for `admin`, `manager`, and `member`. [Status: Completed]
- [x] **Privilege Escalation Prevention:** Self-elevation blocked on public registration; defaults to `member`. [Status: Completed]
- [x] **Secrets Isolation:** `.env` strictly excluded from version control; `.env.example` templates provided. [Status: Completed]
- [x] **HTTP Header Hardening:** Helmet and CORS configured for origin isolation. [Status: Completed]
- [x] **Rate Limiting:** `express-rate-limit` active on `/api/auth/*` endpoints. [Status: Completed]

---

## 3. Business Logic & Feature Requirements

- [x] **Project Management:** Create, list (filter/search), get by ID, update, delete, and member management. [Status: Completed]
- [x] **Sprint Kanban Board:** Drag-and-drop workflow across To Do, In Progress, In Review, Completed with REST persistence. [Status: Completed]
- [x] **Task Assignment Constraints:** Verification that assigned users belong to the parent project. [Status: Completed]
- [x] **Task Collaboration:** Contextual task-level comments with author ownership verification. [Status: Completed]
- [x] **In-App Notification Center:** Alerts for task assignments, status changes, and project invites. [Status: Completed]
- [x] **Activity Audit Trail:** Real-time mutation logging into `ActivityLog`. [Status: Completed]
- [x] **Dynamic Dashboard:** Aggregations computed from real MongoDB data without hardcoded values. [Status: Completed]
- [x] **User Management (Admin):** Search users, change roles, activate/deactivate accounts. [Status: Completed]

---

## 4. Testing & Verification Requirements

- [x] **Automated Test Suite:** Jest + Supertest integration tests in `backend/tests/api.test.js` (13/13 passed). [Status: Completed]
- [x] **Postman Test Collection:** Exported collection with 20 requests in `docs/postman/WorkNest_API.postman_collection.json`. [Status: Completed]
- [x] **Functional Manual Testing:** All forms, route transitions, and responsive layouts verified. [Status: Completed]

---

## 5. Deployment & Documentation Requirements

- [x] **Deployment Configurations:** `frontend/vercel.json` and `backend/render.yaml` configured. [Status: Completed]
- [x] **Live Cloud Hosting:** Ready for user/mentor credentials configuration (Atlas URI, Vercel/Render accounts). [Status: Blocked by External Credentials]
- [x] **Comprehensive Documentation:** Full `README.md`, technical architecture, database design, API docs, and submission package. [Status: Completed]
- [x] **Presentation Script:** 5-minute technical demonstration walkthrough in `docs/presentation-script.md`. [Status: Completed]
- [x] **PDF Submission Report:** Generated via ReportLab tooling. [Status: Completed]
