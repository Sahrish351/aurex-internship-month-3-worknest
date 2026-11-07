# AUREX Month 3: Internship Submission Checklist & Evaluation Audit

## Submission Metadata
- **Intern:** Sahrish (GitHub: `Sahrish351`)
- **Repository:** `aurex-internship-month-3-worknest`
- **Internship:** AUREX Full-Stack Engineering Internship
- **Month:** Month 3 — Industry Projects & Readiness
- **Project Name:** WorkNest — Team Project & Task Management Platform
- **Project Category:** Task/project management system (AUREX Approved Category, DOCX item 112)
- **Approval Flag:** **PROPOSED PROJECT — Pending Formal Mentor Sign-Off**
- **Date of Initial Audit:** November 2026

---

## Evaluation Scoring Breakdown (Total: 100%)

| Evaluation Category | Weight | Target Criteria | Self-Assessment Status |
| :--- | :---: | :--- | :--- |
| **1. Project Planning & Architecture** | 10% | Requirement specifications, system architecture diagrams (Mermaid), database schemas, and REST API endpoint blueprints. | Baseline Completed (Week 1 Docs) |
| **2. React & Frontend Implementation** | 15% | Component hierarchy, state management, controlled forms, React Router DOM, responsive UI, Tailwind CSS. | In Progress (Phase 7-8) |
| **3. Backend & API Development** | 15% | Express server structure, MVC controllers, middleware, proper status codes, modular route architecture, error handler. | In Progress (Phase 4) |
| **4. Database & Data Management** | 10% | Mongoose models (6 entities), schema validation, entity relationships, indexes, CRUD persistence. | In Progress (Phase 4) |
| **5. Authentication & Security** | 10% | Password hashing (`bcrypt`), JWT implementation, protected routes, Role-Based Access Control (RBAC), Helmet, rate-limit. | In Progress (Phase 5) |
| **6. Business Features & Functionality** | 10% | Interactive Kanban board, task assignment validation, comments, internal notifications, dynamic activity feed. | In Progress (Phase 6) |
| **7. Testing & Debugging** | 10% | Postman test collection (positive & negative), Supertest backend integration suite, functional testing evidence. | In Progress (Phase 9) |
| **8. Production Deployment** | 5% | Live deployment of frontend (Vercel) and backend (Render/Railway) connected to MongoDB Atlas. | Ready for Configuration (Phase 11) |
| **9. Code Quality & GitHub Practice** | 5% | Repository organization (`/frontend`, `/backend`), meaningful commits, clean `.gitignore`, zero committed credentials. | In Progress (Phase 3-11) |
| **10. Documentation & Presentation** | 5% | Comprehensive `README.md`, Mermaid architecture diagrams, user flow docs, presentation script, PDF submission report. | In Progress (Phase 10) |
| **11. Independence & Problem Solving** | 5% | Self-directed implementation, solving complex domain constraints, clear technical explanations. | Active |
| **Total Evaluation** | **100%** | **Targeting Maximum Grade across all 11 categories.** | **Active Development** |

---

## Deliverables Status Tracker

### 1. Requirements & Planning Deliverables (Week 1)
- [x] **REQUIREMENT_ANALYSIS.md** — Exhaustive analysis of `Month 3.docx` and `AUREX Month 3 Full-Stack Engineering Roadmap.pdf`.
- [x] **REQUIREMENT_TRACEABILITY.md** — Matrix mapping every requirement to concrete backend and frontend artifacts.
- [x] **FOUR_WEEK_DEVELOPMENT_PLAN.md** — Structured 4-week roadmap with weekly hour allocations and milestone checklists.
- [x] **SUBMISSION_CHECKLIST.md** — Comprehensive evaluation checklist with integrity verification rules.
- [x] **System Architecture Blueprint** — Visual diagram illustrating React $\longleftrightarrow$ REST API $\longleftrightarrow$ Express $\longleftrightarrow$ Mongoose $\longleftrightarrow$ MongoDB.
- [x] **Database ER Diagram** — Entity-relationship diagram covering User, Project, Task, Comment, Notification, ActivityLog.
- [x] **REST API Specification Blueprint** — Documented endpoint catalog with request/response schemas.

### 2. Full-Stack Implementation Deliverables (Week 2 & 3)
- [ ] **Clean Project Structure** — Isolated `/frontend` and `/backend` directories.
- [ ] **Mongoose Models (6 Entities):**
  - [ ] `User.js` (name, email, password, role, avatar, status)
  - [ ] `Project.js` (title, description, owner, members, dates, priority, status)
  - [ ] `Task.js` (title, description, project, assignee, creator, priority, status, dueDate)
  - [ ] `Comment.js` (task, user, text, timestamps)
  - [ ] `Notification.js` (recipient, title, message, type, read, link)
  - [ ] `ActivityLog.js` (actor, action, entityType, entityId, details)
- [ ] **REST API Endpoints:**
  - [ ] Authentication: Register, Login, Logout, Me, Change Password
  - [ ] Projects: Create, List (filter/search/sort/page), Get by ID, Update, Delete/Archive, Manage Members
  - [ ] Tasks: Create, List (by project/status/assignee), Get by ID, Update, Patch Status, Delete
  - [ ] Comments: Add, List, Update, Delete
  - [ ] Notifications: List, Mark Read, Mark All Read
  - [ ] Dashboard: Aggregate Stats, Recent Activity, My Tasks
  - [ ] Users (Admin): List Users, Update User Status, Update User Role
- [ ] **Role-Based Access Control (RBAC):**
  - [ ] Backend middleware enforcing Admin, Project Manager, and Team Member capabilities.
  - [ ] Frontend route protection (`ProtectedRoute`, `RoleGuard`).
  - [ ] Prevention of privilege escalation (default `member` role upon registration).
- [ ] **Frontend Application Views:**
  - [ ] Public Landing Page (Hero, Features, How it Works, FAQ, CTA, Footer).
  - [ ] Authentication Views (Login, Register with password strength and visibility toggle).
  - [ ] Role-Tailored Dashboards (Admin, Manager, Member).
  - [ ] Project Management (Project List, Detail view, Membership modal).
  - [ ] Interactive Kanban Board (Drag-and-drop status transitions with backend persistence).
  - [ ] Task Management (Detail modal, Comments section).
  - [ ] Internal Notification Center.
  - [ ] User Profile & Settings.
  - [ ] Professional 401, 403, and 404 Error Pages.

### 3. Testing & Verification Deliverables (Week 3 & 4)
- [ ] **Automated Backend Integration Suite:**
  - [ ] Supertest test cases for Authentication, Projects, Tasks, and RBAC permissions.
- [ ] **Postman API Test Collection:**
  - [ ] `docs/postman/WorkNest_API.postman_collection.json` containing positive and negative test cases.
- [ ] **Manual Testing Checklist & Execution Evidence:**
  - [ ] Authentication and RBAC verification.
  - [ ] Kanban state persistence verification.
  - [ ] Cascade deletion and referential integrity tests.
  - [ ] Responsive viewport verification (Mobile, Tablet, Desktop).

### 4. Production Deployment & Documentation (Week 4)
- [ ] **Root README.md** with project overview, architecture diagram, setup instructions, and badges.
- [ ] **Technical Documentation** in `docs/` (`architecture.md`, `database-design.md`, `api-documentation.md`, etc.).
- [ ] **Security Compliance:**
  - [ ] `.env` excluded from version control in all directories.
  - [ ] `.env.example` templates provided.
  - [ ] Helmet, CORS, and rate limiting active.
- [ ] **Cloud Deployment Configurations:**
  - [ ] Frontend Vercel configuration (`vercel.json`).
  - [ ] Backend Render/Railway configuration.
  - [ ] Database connection to MongoDB Atlas.
- [ ] **Internship Submission Package** in `SUBMISSION/`:
  - [ ] `AUREX_Month_3_Submission_Report.md` (and generated PDF).
  - [ ] `Completed_Requirements_Checklist.md`.
  - [ ] `Technical_Implementation_Report.md`.
  - [ ] `Testing_Evidence.md`.
  - [ ] `Project_Presentation.md` with demonstration script.

---

## Strict Integrity & Reporting Directives
In accordance with AUREX Month 3 Ethics Guidelines (Roadmap PDF Section 6; DOCX Section 680–688):
1. **No Fabricated Evidence:** Never claim tests pass without executing them. Never claim deployment without active production URLs.
2. **Clear Status Classification:** Every feature is marked **Completed**, **Partially Completed**, **Not Completed**, or **Blocked by External Credentials**.
3. **True Code Ownership:** All architecture and logic are implemented cleanly and can be defended independently in mentor review.
