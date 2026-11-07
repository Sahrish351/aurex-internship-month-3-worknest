# AUREX Month 3: Requirement Traceability Matrix (RTM)

## Document Metadata
- **Project:** WorkNest — Team Project & Task Management Platform
- **Program:** AUREX Full-Stack Engineering Internship (Month 3)
- **Status:** Complete Bidirectional Traceability Baseline
- **Approval Note:** WorkNest is a candidate project proposal under the "Task/project management system" category (DOCX item 112); formal mentor approval is required before final evaluation.

---

## 1. Traceability Overview
This matrix provides strict bidirectional traceability between:
1. **AUREX Month 3 Specifications** (`Month 3.docx` and `AUREX Month 3 Full-Stack Engineering Roadmap.pdf`)
2. **Master Development Directives** (Architecture, UI/UX, Security, Roles, Business Features)
3. **Backend Implementation** (Models, Controllers, Middleware, Routes)
4. **Frontend Implementation** (Components, Context, Services, Pages)
5. **Verification & Testing Artifacts** (Jest/Supertest, Postman Collection, Manual Verification)

---

## 2. Master Traceability Matrix

| Req ID | AUREX Source Ref | Master Directive | Feature Description | Backend Target | Frontend Target | Test / Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-ARC-01** | PDF p.1 Task 1; DOCX 141-143 | Part 1, 8, 15 | Separation of concerns (Frontend -> API -> Express -> Mongoose -> MongoDB) | `backend/src/app.js`, `server.js`, `routes/`, `controllers/` | `frontend/src/services/api.js`, `App.jsx` | Integration test server ping; architecture diagram review | Planned |
| **REQ-ARC-02** | DOCX 165-172, 480-490; PDF p.2 Task 4 | Part 18 | Monorepo structure with `/frontend`, `/backend`, `.gitignore`, root documentation | Root directory, `.gitignore`, `backend/`, `frontend/` | `frontend/` directory structure | Git status check, directory tree audit | Planned |
| **REQ-DB-01** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | User Schema with unique email, bcrypt hash, role enum, status | `backend/src/models/User.js` | `frontend/src/pages/auth/Register.jsx` | Unit test validation; schema duplicate index check | Planned |
| **REQ-DB-02** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | Project Schema with owner, members array, dates, status, priority | `backend/src/models/Project.js` | `frontend/src/pages/projects/ProjectList.jsx` | Schema validation test; referential integrity test | Planned |
| **REQ-DB-03** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | Task Schema referencing Project, assignee, creator, status, priority, due date | `backend/src/models/Task.js` | `frontend/src/pages/tasks/KanbanBoard.jsx` | Schema relationship tests; cascade cleanup tests | Planned |
| **REQ-DB-04** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | Comment Schema referencing Task and User | `backend/src/models/Comment.js` | `frontend/src/components/tasks/TaskComments.jsx` | Comment CRUD integration tests | Planned |
| **REQ-DB-05** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | Notification Schema referencing User, read status, type, timestamp | `backend/src/models/Notification.js` | `frontend/src/components/notifications/NotificationCenter.jsx` | Notification generation & read-state test | Planned |
| **REQ-DB-06** | PDF p.1 Task 1; DOCX 144-153 | Part 7 | ActivityLog Schema referencing actor, action, resource, timestamp | `backend/src/models/ActivityLog.js` | `frontend/src/components/dashboard/ActivityFeed.jsx` | Activity audit trail verification test | Planned |
| **REQ-SEC-01** | PDF p.2 Sec 5; DOCX 306-314 | Part 10 | Cryptographic password hashing via `bcrypt` | `backend/src/models/User.js` (pre-save hook) | `frontend/src/pages/auth/Register.jsx` | Bcrypt salt verification test; plain-text leakage test | Planned |
| **REQ-SEC-02** | PDF p.2 Sec 5; DOCX 306-314 | Part 10 | JWT token generation, verification, and expiration handling | `backend/src/utils/token.js`, `middleware/authenticate.js` | `frontend/src/context/AuthContext.jsx`, `services/api.js` | Postman positive/negative auth test; Supertest auth test | Planned |
| **REQ-SEC-03** | PDF p.2 Sec 5; DOCX 315-319 | Part 5, 10 | Role-Based Access Control (Admin, Project Manager, Team Member) | `backend/src/middleware/authorize.js` | `frontend/src/routes/RoleGuard.jsx` | Supertest forbidden 403 test on unauthorized role endpoints | Planned |
| **REQ-SEC-04** | PDF p.2 Sec 5; DOCX 428-433 | Part 10 | Secrets isolation, CORS origin restricting, Helmet HTTP headers, rate limiting | `backend/src/config/environment.js`, `app.js` | `frontend/.env.example` | Security header scanner, environment check | Planned |
| **REQ-AUT-01** | DOCX 156-157, 308-314; PDF p.1 Task 3 | Part 4, 9 | User Registration API (`POST /api/auth/register`) | `backend/src/controllers/authController.js` | `frontend/src/pages/auth/Register.jsx` | Postman test; duplicate email test (409) | Planned |
| **REQ-AUT-02** | DOCX 156-157, 308-314; PDF p.1 Task 3 | Part 4, 9 | User Login API (`POST /api/auth/login`) | `backend/src/controllers/authController.js` | `frontend/src/pages/auth/Login.jsx` | Postman test; invalid password test (401) | Planned |
| **REQ-AUT-03** | DOCX 308-314; PDF p.1 Task 3 | Part 4, 9 | Get Current User Session (`GET /api/auth/me`) | `backend/src/controllers/authController.js` | `frontend/src/context/AuthContext.jsx` | Auth token persistence test on page refresh | Planned |
| **REQ-AUT-04** | DOCX 308-314 | Part 6, 9 | Change Password (`PATCH /api/auth/change-password`) | `backend/src/controllers/authController.js` | `frontend/src/pages/member/ProfileSettings.jsx` | Password update & subsequent login test | Planned |
| **REQ-PRJ-01** | DOCX 158-163, 276-278 | Part 6, 9 | Create Project API (`POST /api/projects`) | `backend/src/controllers/projectController.js` | `frontend/src/components/projects/CreateProjectModal.jsx` | Supertest project creation; validation check | Planned |
| **REQ-PRJ-02** | DOCX 158-163, 276-278 | Part 6, 9 | List Projects with search, filter, pagination (`GET /api/projects`) | `backend/src/controllers/projectController.js` | `frontend/src/pages/projects/ProjectList.jsx` | Query parameter test (status, search, page) | Planned |
| **REQ-PRJ-03** | DOCX 158-163, 276-278 | Part 6, 9 | Get Project Details with populated members & tasks (`GET /api/projects/:id`) | `backend/src/controllers/projectController.js` | `frontend/src/pages/projects/ProjectDetails.jsx` | ID validation test (404/400) | Planned |
| **REQ-PRJ-04** | DOCX 158-163, 276-278 | Part 6, 9 | Update Project API (`PUT /api/projects/:id`) | `backend/src/controllers/projectController.js` | `frontend/src/components/projects/EditProjectModal.jsx` | Manager/Admin update permission test | Planned |
| **REQ-PRJ-05** | DOCX 158-163, 276-278 | Part 6, 9 | Delete / Archive Project (`DELETE /api/projects/:id`) | `backend/src/controllers/projectController.js` | `frontend/src/pages/projects/ProjectDetails.jsx` | Ownership verification & soft/hard delete test | Planned |
| **REQ-PRJ-06** | DOCX 247, 330-347 | Part 6, 9 | Manage Project Members (`POST/DELETE /api/projects/:id/members`) | `backend/src/controllers/projectController.js` | `frontend/src/components/projects/ProjectTeamModal.jsx` | Member addition/removal permission check | Planned |
| **REQ-TSK-01** | DOCX 245-256, 330-347 | Part 6, 9 | Create Task API (`POST /api/tasks`) | `backend/src/controllers/taskController.js` | `frontend/src/components/tasks/CreateTaskModal.jsx` | Validation: assignee must belong to project | Planned |
| **REQ-TSK-02** | DOCX 245-256, 330-347 | Part 6, 9 | Get Tasks with filtering by project, status, priority (`GET /api/tasks`) | `backend/src/controllers/taskController.js` | `frontend/src/pages/tasks/TaskList.jsx` | Filter/sort/pagination query tests | Planned |
| **REQ-TSK-03** | DOCX 245-256, 330-347 | Part 6, 9 | Update Task API (`PUT /api/tasks/:id`) | `backend/src/controllers/taskController.js` | `frontend/src/components/tasks/EditTaskModal.jsx` | Detail update test | Planned |
| **REQ-TSK-04** | DOCX 245-256, 330-347 | Part 6, 9 | Patch Task Status (`PATCH /api/tasks/:id/status`) for Kanban | `backend/src/controllers/taskController.js` | `frontend/src/pages/tasks/KanbanBoard.jsx` | Drag-and-drop state persistence verification | Planned |
| **REQ-TSK-05** | DOCX 245-256, 330-347 | Part 6, 9 | Delete Task API (`DELETE /api/tasks/:id`) | `backend/src/controllers/taskController.js` | `frontend/src/pages/tasks/KanbanBoard.jsx` | Deletion permission & cascade comment cleanup | Planned |
| **REQ-COM-01** | DOCX 247, 330-347 | Part 6, 9 | Add Task Comment (`POST /api/tasks/:id/comments`) | `backend/src/controllers/commentController.js` | `frontend/src/components/tasks/TaskComments.jsx` | Comment creation & activity log trigger test | Planned |
| **REQ-COM-02** | DOCX 247, 330-347 | Part 6, 9 | List Task Comments (`GET /api/tasks/:id/comments`) | `backend/src/controllers/commentController.js` | `frontend/src/components/tasks/TaskComments.jsx` | Chronological comment retrieval test | Planned |
| **REQ-COM-03** | DOCX 247, 330-347 | Part 6, 9 | Edit/Delete Comment (`PUT/DELETE /api/comments/:id`) | `backend/src/controllers/commentController.js` | `frontend/src/components/tasks/TaskComments.jsx` | Author ownership validation (403 for others) | Planned |
| **REQ-NOT-01** | DOCX 330-347 | Part 6, 9 | Get Notifications (`GET /api/notifications`) | `backend/src/controllers/notificationController.js` | `frontend/src/components/notifications/NotificationCenter.jsx` | User notification list & unread count test | Planned |
| **REQ-NOT-02** | DOCX 330-347 | Part 6, 9 | Mark Notification Read (`PATCH /api/notifications/:id/read`, `read-all`) | `backend/src/controllers/notificationController.js` | `frontend/src/components/notifications/NotificationCenter.jsx` | Read state toggle test | Planned |
| **REQ-ACT-01** | DOCX 330-347 | Part 6, 9 | Automated Activity Logging on project/task mutations | `backend/src/controllers/activityController.js` | `frontend/src/components/dashboard/ActivityFeed.jsx` | Activity generation verification on task create | Planned |
| **REQ-DSH-01** | DOCX 276-278, 340-342 | Part 6, 9 | Dynamic Role-Specific Dashboard Metrics (`GET /api/dashboard/stats`) | `backend/src/controllers/dashboardController.js` | `frontend/src/pages/dashboard/Dashboard.jsx` | Aggregation pipeline test; zero hardcoded metrics | Planned |
| **REQ-UI-01** | DOCX 106, 186; Master Part 3 | Part 3, 4 | Editorial-inspired premium SaaS UI (Warm Ivory, Forest Green, DM Serif) | `frontend/tailwind.config.js`, `index.css` | All frontend views | UI design consistency audit, contrast check | Planned |
| **REQ-UI-02** | DOCX 186, 257-258 | Part 4 | Comprehensive Public Landing Page with responsive sections | `frontend/src/pages/public/LandingPage.jsx` | `LandingPage.jsx` (Hero, Features, FAQ, CTA) | Visual & responsive audit; working navigation links | Planned |
| **REQ-UI-03** | DOCX 257-258, 441-447 | Part 4, 11 | Responsive layout with collapsible sidebar, navbar, and mobile drawer | `frontend/src/components/layout/AppLayout.jsx` | `Sidebar.jsx`, `Navbar.jsx`, `AppLayout.jsx` | Mobile / Tablet / Desktop viewport testing | Planned |
| **REQ-UI-04** | DOCX 265-267 | Part 11, 13 | UI Feedback: Skeletons, empty states, error boundaries, toast notifications | `frontend/src/components/common/` | `LoadingSkeleton.jsx`, `EmptyState.jsx`, `Toast.jsx` | Network throttling / error simulation tests | Planned |
| **REQ-TST-01** | PDF p.2 Sec 4; DOCX 367-373 | Part 14 | Postman API test collection covering positive & negative paths | `docs/postman/WorkNest_API.postman_collection.json` | Postman execution | Postman Runner execution with 100% passes | Planned |
| **REQ-TST-02** | PDF p.2 Sec 4; DOCX 358-366 | Part 14 | Automated Integration test suite with Supertest | `backend/tests/` | npm test script | Automated test execution with zero failures | Planned |
| **REQ-DEP-01** | PDF p.2 Sec 4; DOCX 434-439 | Part 19 | Production deployment configuration for Vercel, Render/Railway, Atlas | `frontend/vercel.json`, `backend/render.yaml` | Production environment configurations | Configuration linting, health endpoint checks | Planned |
| **REQ-DOC-01** | PDF p.2 Sec 6; DOCX 463-478 | Part 15, 16 | Comprehensive README.md with architecture, database, API, setup docs | Root `README.md`, `docs/*.md` | Visual & technical review | Markdown rendering check; link validation | Planned |
| **REQ-DOC-02** | DOCX 491-512; Master Part 17 | Part 17 | Formal Internship Submission Package & Reports | `SUBMISSION/` folder artifacts | Markdown & PDF export | Document verification and checklist sign-off | Planned |

---

## 3. Coverage Analysis
- **AUREX Month 3 Tasks Covered:** 100% (All 4 Core Tasks and Weekly Milestones represented).
- **Mandatory Technical Requirements:** 100% (React, Vite, Express, MongoDB, Mongoose, JWT, bcrypt, Postman, Vercel/Render prep).
- **User Roles Covered:** Admin, Project Manager, Team Member.
- **Security Policies Enforced:** Zero-secret leakage, bcrypt hashing, backend RBAC.
