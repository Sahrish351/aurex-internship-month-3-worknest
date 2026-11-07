# AUREX Month 3: Four-Week Development Plan & Roadmap

## Project Overview
- **Project Name:** WorkNest — Team Project & Task Management Platform
- **Internship:** AUREX Full-Stack Engineering Internship (Month 3)
- **Proposed Category:** Task/project management system (DOCX item 112)
- **Approval Flag:** **PROPOSED PROJECT (Requires formal mentor approval before milestone sign-off)**
- **Cadence:** 4 Weeks | 40 Total Hours | ~10 Hours/Week
- **Weekly Schedule:** Development Monday–Friday, Milestone Submission Saturday, Mentor Review Sunday.

---

## Weekly Time Allocation Model (10 Hours / Week)
As defined in AUREX Month 3 guidelines (DOCX Section 41–56):
- **Project Planning & Research:** 1.5 Hours
- **Development & Implementation:** 5.0 Hours
- **Testing & Debugging:** 1.5 Hours
- **Documentation & GitHub Version Control:** 1.0 Hour
- **Self-Review & Code Quality Audit:** 1.0 Hour
- **Total:** **10.0 Hours / Week**

---

## WEEK 1 — Project Planning, Architecture & Development Setup
> **Theme:** Real-World Requirement Analysis + System Design + Project Setup  
> **AUREX Focus:** Requirement $\longrightarrow$ Architecture $\longrightarrow$ Database $\longrightarrow$ API $\longrightarrow$ Development Plan

### Weekly Objectives & Tasks
1. **Requirement Analysis (1.5h):**
   - Synthesize requirements from `Month 3.docx` and `AUREX Month 3 Full-Stack Engineering Roadmap.pdf`.
   - Identify user personas: Administrator, Project Manager, Team Member.
   - Define functional boundaries (Projects, Tasks, Comments, Notifications, Activity Logs) and non-functional requirements (security, responsiveness, performance).
2. **System Architecture Design (1.5h):**
   - Design multi-tier decoupled architecture: React SPA $\longleftrightarrow$ REST API $\longleftrightarrow$ Express Engine $\longleftrightarrow$ Mongoose ODM $\longleftrightarrow$ MongoDB Atlas.
   - Construct visual architecture diagrams in Mermaid.
3. **Database Schema Modeling (1.5h):**
   - Design schemas for 6 core entities: `User`, `Project`, `Task`, `Comment`, `Notification`, `ActivityLog`.
   - Establish referential integrity (ObjectId references, cascading updates/deletes).
   - Create Entity-Relationship (ER) diagram in Mermaid.
4. **REST API Planning (1.5h):**
   - Specify endpoint routes, HTTP verbs, payload contracts, authentication gates, and expected status codes.
5. **Project Scaffolding & Git Setup (2.0h):**
   - Initialize Git repository with structured monorepo layout: `/frontend` and `/backend`.
   - Configure root and subfolder `.gitignore` to prevent credential exposure.
   - Write `.env.example` configurations.
6. **Documentation & Review (2.0h):**
   - Author `requirements/REQUIREMENT_ANALYSIS.md`, `REQUIREMENT_TRACEABILITY.md`, and `FOUR_WEEK_DEVELOPMENT_PLAN.md`.
   - Prepare Week 1 Saturday submission package.

### Saturday Submission Checklist (Week 1 Deliverables)
- [x] Initialized GitHub repository with clean commit history.
- [x] Project Planning & Technical Design Document.
- [x] System Architecture Diagram (Mermaid).
- [x] Database Schema Design & ER Diagram (Mermaid).
- [x] Complete REST API Blueprint.
- [x] Basic UI/UX Design Direction & Color Palette Specification.
- [x] Four-Week Development Plan & Time Breakdown.

---

## WEEK 2 — Full-Stack Core Development
> **Theme:** Frontend + Backend + Database Integration  
> **AUREX Focus:** React $\longleftrightarrow$ API $\longleftrightarrow$ Express $\longleftrightarrow$ MongoDB (End-to-End Core)

### Weekly Objectives & Tasks
1. **Backend Foundation (3.0h):**
   - Initialize Node.js & Express server with MVC pattern (`config/`, `controllers/`, `models/`, `routes/`, `middleware/`, `utils/`).
   - Configure MongoDB Atlas connection with retry handling.
   - Implement Mongoose models with validation, indexes, and relationship refs.
   - Implement centralized error handling middleware and HTTP 404 handler.
2. **Core REST API Implementation (2.5h):**
   - Build CRUD endpoints for Projects (`POST`, `GET`, `PUT`, `DELETE`).
   - Build CRUD endpoints for Tasks with filtering, sorting, and pagination.
   - Implement project membership management endpoints.
3. **Frontend Application Setup (2.5h):**
   - Scaffold React 18+ application with Vite and Tailwind CSS.
   - Set up editorial-inspired theme: Warm Ivory (`#FAF9F6`), Deep Forest Green (`#173D32`), Primary Green (`#286B52`), Light Sage (`#E7EFE9`), DM Serif Display & Inter typography.
   - Configure React Router DOM with layout wrappers (`AppLayout`, `Sidebar`, `Navbar`).
   - Create Axios instance with base URL configuration and response interceptors.
4. **Core UI & API Integration (1.0h):**
   - Implement Project List and Project Details views with live API data.
   - Implement Task List and Task Creation modals.
   - Build UI feedback states (Skeleton loaders, Empty states, Toast feedback).
5. **Testing & Self-Review (1.0h):**
   - Verify end-to-end data flow: Form input $\longrightarrow$ API request $\longrightarrow$ Express $\longrightarrow$ Mongoose $\longrightarrow$ MongoDB persistence $\longrightarrow$ React rendering.

### Saturday Submission Checklist (Week 2 Deliverables)
- [ ] Working Express backend with live MongoDB connection.
- [ ] Working React frontend consuming backend APIs.
- [ ] Complete Project and Task Mongoose models and validation.
- [ ] Functional Project CRUD and Task CRUD operations.
- [ ] UI feedback handling: loading skeletons, errors, empty states.
- [ ] Screenshots/evidence of end-to-end data persistence.

---

## WEEK 3 — Authentication, Advanced Features & Testing
> **Theme:** Authentication + Authorization + Business Logic + Testing  
> **AUREX Focus:** Multi-Role RBAC, Complex Feature Workflows, Postman & Automated Verification

### Weekly Objectives & Tasks
1. **Authentication Engine (2.5h):**
   - Implement password hashing via `bcrypt` (12 salt rounds) in User schema hooks.
   - Implement JWT token signing and verification utility.
   - Build authentication controllers: `register`, `login`, `logout`, `getCurrentUser`, `changePassword`.
   - Enforce default `member` role upon registration (preventing self-elevation).
2. **Role-Based Access Control (RBAC) & Route Protection (2.0h):**
   - Build `authenticate` and `authorize(...roles)` Express middlewares.
   - Protect backend endpoints by role: Admin (user management, global oversight), Project Manager (project creation, assignment), Team Member (assigned task updates).
   - Implement frontend `ProtectedRoute` and `RoleGuard` in React Router.
3. **Advanced Business Logic & Domain Features (2.5h):**
   - **Kanban Board:** Interactive drag-and-drop board with columns (`To Do`, `In Progress`, `In Review`, `Completed`). Persist status updates via `PATCH /api/tasks/:id/status`.
   - **Task Membership Constraints:** Verify assigned user belongs to the project before assignment.
   - **Comments Engine:** Task-level comments with author-only edit/delete verification.
   - **Internal Notifications:** Automatic notification triggers on task assignment, status change, and project membership updates.
   - **Activity Audit Trail:** Automatic backend logging of all mutations into `ActivityLog`.
4. **Testing Suite & Postman Collection (2.0h):**
   - Write automated integration test suite with Supertest/Jest covering auth, RBAC, projects, and tasks.
   - Create comprehensive Postman collection (`WorkNest_API.postman_collection.json`) with environment variables, positive flows, and negative edge cases (unauthorized, invalid ID, validation errors).
5. **Self-Review & Bug Fixing (1.0h):**
   - Audit edge cases: duplicate emails, malformed ObjectIds, cross-role tampering.

### Saturday Submission Checklist (Week 3 Deliverables)
- [ ] Fully functional JWT authentication and bcrypt password hashing.
- [ ] Backend and frontend Role-Based Access Control (Admin, Manager, Member).
- [ ] Interactive Kanban board with persistent status updates.
- [ ] Task comments, internal notifications, and activity audit logging.
- [ ] Exportable Postman API test collection.
- [ ] Automated integration test execution report.

---

## WEEK 4 — Deployment, Testing, Documentation & Final Presentation
> **Theme:** Production Readiness + Deployment + Portfolio Package  
> **AUREX Focus:** Live Cloud Hosting, Comprehensive Portfolio Documentation, Presentation Script

### Weekly Objectives & Tasks
1. **Production Hardening & Optimization (2.0h):**
   - Configure Helmet security headers, CORS origin restrictions, and request rate limiting.
   - Audit `.gitignore` across the repository to guarantee zero credentials or secrets are tracked.
   - Create clean production build configurations (`vite build`, Express static serving if applicable).
2. **Cloud Deployment Preparation (2.5h):**
   - Configure Vercel deployment for React frontend (`vercel.json`, client-side routing rewrites).
   - Configure Render / Railway deployment for Express backend (`render.yaml` or build/start scripts).
   - Verify MongoDB Atlas production cluster connection and IP access rules.
   - Implement `/api/health` monitoring endpoint.
3. **Comprehensive Documentation (2.5h):**
   - Draft production-grade root `README.md` with badges, architecture diagrams, setup guides, and API specs.
   - Author technical documentation files in `docs/`: architecture, database design, API docs, technical decisions, challenges & solutions.
4. **Internship Submission Package Assembly (2.0h):**
   - Create formal submission documents in `SUBMISSION/`:
     - `AUREX_Month_3_Submission_Report.md` (and generated PDF).
     - `Completed_Requirements_Checklist.md`.
     - `Technical_Implementation_Report.md`.
     - `Testing_Evidence.md`.
     - `Project_Presentation.md` with 5-minute presentation script.
5. **Final QA & Mentor Demo Dry-Run (1.0h):**
   - Verify all links, forms, buttons, and responsive breakpoints (mobile, tablet, desktop).
   - Complete 36-point final QA audit.

### Saturday Submission Checklist (Week 4 Final Deliverables)
- [ ] Complete production full-stack application code in GitHub.
- [ ] Live deployed URLs (Frontend on Vercel, Backend on Render/Railway, MongoDB Atlas).
- [ ] Complete Postman collection with test evidence.
- [ ] Professional GitHub README.md with architecture & setup instructions.
- [ ] Full `SUBMISSION/` documentation package.
- [ ] Project presentation script and demonstration walkthrough.
