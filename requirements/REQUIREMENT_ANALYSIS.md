# AUREX Full-Stack Engineering Internship — Month 3: Requirement Analysis

## Document Metadata & Status
- **Internship Program:** AUREX Full-Stack Engineering Internship
- **Stage:** Month 3 — Industry-Level Full-Stack Projects & Industry Readiness
- **Project Name:** WorkNest — Team Project & Task Management Platform
- **Project Approval Status:** **PROPOSED PROJECT (Pending Mentor Formal Approval)**
  > [!IMPORTANT]
  > **Project Approval Notice:** According to AUREX Month 3 guidelines (Section 108: "Each intern/team will be assigned or approved a real-world project"), WorkNest is a candidate project proposal falling under the approved category *"Task/project management system"* (Section 112). It is not yet officially assigned or signed off by an AUREX mentor. No pre-approval is claimed.
- **Date of Analysis:** November 2026
- **Source Documents Analyzed:**
  1. `Month 3.docx` (Comprehensive Curriculum, 772 lines / 21,145 characters)
  2. `AUREX Month 3 Full-Stack Engineering Roadmap.pdf` (2 Pages / 5,126 characters)

---

## 1. Executive Summary & Month 3 Objective
The primary objective of AUREX Month 3 is transitioning interns from isolated technical learning (Month 1 Foundation, Month 2 Full-Stack Basics) to designing, architecting, building, testing, securing, documenting, and deploying a production-grade, industry-style full-stack application.

Interns must independently execute the complete project lifecycle:
$$\text{Requirement Analysis} \longrightarrow \text{Architecture \& Schema/API Design} \longrightarrow \text{Full-Stack Core} \longrightarrow \text{RBAC Auth \& Business Logic} \longrightarrow \text{Testing, Production Deployment \& Portfolio}$$

---

## 2. Comparative Analysis: DOCX vs. PDF Specifications

| Dimension | `AUREX Month 3 Full-Stack Engineering Roadmap.pdf` | `Month 3.docx` | Integrated Synthesis |
| :--- | :--- | :--- | :--- |
| **Workload & Cadence** | 1 Month (4 Weeks), 40 Hours total, ~10 Hours/week, Online + Mentor. | 4 Weeks, 10 Hours/week, Saturday submission, Sunday Mentor review, Sunday night next milestone release. | Strict weekly cycle: Saturday submission, Sunday evaluation, 10h/week (1.5h plan, 5h dev, 1.5h test, 1h docs, 1h self-review). |
| **Project Core Lifecycle** | 4 Integrated Core Modules: System Architecture, Full-Stack Core, RBAC & Advanced Logic, Production & Deliverable. | 4 Detailed Weekly Themes with practical tasks, sub-tasks, and specific mentor review criteria. | Direct 1:1 alignment between Weeks 1-4 and Core Tasks 1-4. |
| **Mandatory Tech Stack** | React, Express, MongoDB, Node.js, Vercel, Render/Railway, Atlas. | React, Express, Node.js, MongoDB/Mongoose, JWT, bcrypt, Postman, Git/GitHub. | Full MERN Stack with JWT, bcrypt, Mongoose, Postman, Git, Vercel, Render/Railway, MongoDB Atlas. No alternative stacks permitted. |
| **Evaluation Framework** | 11 Weighted Categories explicitly specified (Total: 100%). | 11 Identical Weighted Categories explicitly specified (Total: 100%). | Exact match on all 11 evaluation categories and percentage weights. |
| **Security & Secrets** | Mandatory directives on secrets isolation (.env in .gitignore), bcrypt hashing, backend RBAC enforcement. | Passwords hashed, JWT secrets private, .env ignored, API input validation, protected routes, zero plain text. | Strict security policy: Zero secrets in version control, strong hashing, backend RBAC, sanitized inputs. |
| **Submission Deliverables** | GitHub repo (/frontend & /backend), live URLs, docs package (architecture, schema blueprint, API list, Postman). | Weekly Saturday deliverables, Final Deliverable package (Planning doc, full app, production version, portfolio). | Complete dual-repo or monorepo structure with `/frontend`, `/backend`, `/docs`, `/requirements`, `/submission`. |

---

## 3. Extraction of Core Tasks & Requirements

### Task 1: System Architecture, Database Design & API Planning (Week 1)
- **Problem Statement & Scope:** Real-world project scope definition, target user personas, functional and non-functional requirements.
- **Entity & Schema Design:** Multi-entity schema modeling in MongoDB/Mongoose with explicit relationships, constraints, referential integrity, and indexing.
- **REST API Blueprint:** Complete endpoint inventory specifying HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), URL structures, request payloads, response schemas, and HTTP status codes.
- **System Architecture:** Visual data-flow architecture diagram:
  $$\text{React.js Frontend} \longleftrightarrow \text{REST API / Axios} \longleftrightarrow \text{Node/Express Engine} \longleftrightarrow \text{Routes, Middleware \& Controllers} \longleftrightarrow \text{Mongoose ODM} \longleftrightarrow \text{MongoDB Atlas}$$
- **Version Control Setup:** Git repository initialization, clear folder structure (`frontend/`, `backend/`), comprehensive `.gitignore` preventing secret leakage.

### Task 2: Full-Stack Core Development (Week 2)
- **Backend Core:** Modular Express.js architecture with MVC pattern (Controllers, Models, Routes, Config, Middleware, Centralized Error Handling).
- **Database Connection:** Resilient MongoDB connection handler with error monitoring and graceful shutdown.
- **Frontend Core:** Component-driven React.js setup using Vite, React Router DOM, reusable UI components, controlled forms, and centralized API service layer.
- **End-to-End Data Flow:** Implementation of full CRUD operations for core business entities with live backend roundtrip, UI loading skeletons, error states, and success feedback.

### Task 3: Role-Based Authentication & Advanced Business Logic (Week 3)
- **Authentication:** Secure registration, login, logout, password hashing using `bcrypt` (minimum 10-12 salt rounds), JSON Web Tokens (JWT) creation, signing, and verification.
- **Role-Based Access Control (RBAC):** Backend route guards enforcing permissions across user roles (Admin, Project Manager, Team Member). Frontend route protection (`ProtectedRoute`, `RoleGuard`).
- **Domain-Specific Business Logic:** Project membership validation, task assignment constraints (assignee must be project member), Kanban board drag-and-drop state persistence, task-level comments with author ownership verification, dynamic activity tracking logs, and internal notification center.
- **Validation & Error Handling:** Comprehensive request payload validation, HTTP status codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`), descriptive error responses without leaking internal stack traces.
- **Testing:** Postman API collection for positive, negative, and edge-case testing; functional testing of frontend and backend integration.

### Task 4: Production Deployment, Testing & Portfolio Deliverable (Week 4)
- **Testing Verification:** Execution of automated and manual test suites, API verification via Postman, regression testing across devices and screen resolutions.
- **Production Configuration:** Dynamic environment configuration (`.env.example`), secure cookie / CORS cross-origin configuration, production rate-limiting, and Helmet security headers.
- **Deployment Strategy:** Frontend deployed to Vercel; Backend deployed to Render or Railway; Database hosted on MongoDB Atlas.
- **Documentation & Portfolio Deliverable:** Master `README.md`, technical architecture docs, database schema blueprints, user flow diagrams, presentation script, and comprehensive internship submission reports.

---

## 4. Mandatory Technology Stack

| Layer | Approved & Mandatory Technology | Purpose in WorkNest |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18+) with Vite | Fast, modern component-driven SPA architecture |
| **Frontend Routing** | React Router DOM (v6+) | Client-side routing, protected routes, and role-based guards |
| **Styling & UI** | Tailwind CSS + Refined Custom Typography | Editorial SaaS design system (DM Serif Display + Inter/DM Sans) |
| **Icons** | Lucide React | Professional, consistent icon set |
| **HTTP Client** | Axios | Configured client with interceptors for auth tokens and error handling |
| **State Management** | React Context API | Centralized authentication, user session, and notification state |
| **Backend Runtime** | Node.js (v18+ LTS / v20+) | High-performance asynchronous JavaScript engine |
| **Backend Framework** | Express.js (v4+) | Robust RESTful API routing, middleware pipeline, and MVC controllers |
| **Database** | MongoDB (v6+) | Document-oriented NoSQL database supporting flexible document schemas with ObjectId references |
| **ODM** | Mongoose (v8+) | Schema modeling, validation, relationship references, hooks, and indexes |
| **Password Security** | bcrypt / bcryptjs | Cryptographic password hashing prior to persistence |
| **Session Security** | JSON Web Tokens (jsonwebtoken) | Stateless, tamper-proof bearer tokens / HttpOnly cookies |
| **API Security** | Helmet, CORS, express-rate-limit | HTTP header hardening, cross-origin control, and brute-force protection |
| **API Testing** | Postman | Automated test collections with environment and collection variables |
| **Integration Testing**| Jest / Vitest + Supertest | Programmatic API testing verifying endpoints, status codes, and RBAC |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend), Atlas (DB) | Scalable production cloud hosting |

---

## 5. Security & Ethics Policies Compliance

1. **Zero Plain-Text Secrets:** All sensitive variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`) are isolated in `.env` files. Both `/backend/.gitignore` and `/frontend/.gitignore` strictly forbid committing `.env` files. `.env.example` templates are provided.
2. **Cryptographic Password Storage:** Passwords are hashed using `bcrypt` with appropriate cost factors. Plain-text passwords are never stored, logged, or returned in API responses.
3. **Backend-Enforced Authorization:** Security is enforced at the controller and middleware level (`authenticate`, `authorize`). Frontend UI hiding of buttons is purely cosmetic; all API routes validate permissions and reject unauthorized actions with `401` or `403`.
4. **Authenticity & Integrity Rule:** No fabricated test results, fictional metrics, fake reviews, or simulated deployment links. Statuses are explicitly declared as **Completed**, **Partially Completed**, or **Pending Configuration**.

---

## 6. Evaluation Criteria & WorkNest Alignment (Total: 100%)

| Evaluation Category | Weight | How WorkNest Satisfies the Criterion |
| :--- | :---: | :--- |
| **1. Project Planning & Architecture** | 10% | Comprehensive requirement analysis, system architecture diagrams, Mongoose NoSQL schema design, and complete REST API specifications. |
| **2. React & Frontend Implementation** | 15% | Modular component hierarchy, responsive layouts, Tailwind CSS styling, controlled forms, React Router DOM, and React Context API state management. |
| **3. Backend & API Development** | 15% | Clean MVC architecture in Express, modular routes, robust controller layer, centralized error middleware, and consistent JSON responses. |
| **4. Database & Data Management** | 10% | 6 interconnected Mongoose models (`User`, `Project`, `Task`, `Comment`, `Notification`, `ActivityLog`), indexes, referential integrity, and cascading cleanup. |
| **5. Authentication & Security** | 10% | Registration, login, logout, bcrypt hashing, JWT token validation, HttpOnly cookie / Bearer support, role-based route protection, Helmet, and rate limiting. |
| **6. Business Features & Functionality** | 10% | Interactive Kanban board with drag-and-drop state persistence, project membership assignment checks, task commenting, notifications, and activity logging. |
| **7. Testing & Debugging** | 10% | Supertest/Jest backend integration tests, functional frontend testing checklist, and exportable Postman API test collection. |
| **8. Production Deployment** | 5% | Deployment configurations for Vercel (frontend), Render/Railway (backend), and MongoDB Atlas (cloud database) with health check endpoints. |
| **9. Code Quality & GitHub Practice** | 5% | Clean folder organization, modular codebase, strict `.gitignore`, descriptive Git commit history, and zero dead code. |
| **10. Documentation & Presentation** | 5% | Exhaustive `README.md`, Mermaid architecture diagrams, database ER diagrams, API reference, presentation script, and formal submission package. |
| **11. Independence & Problem Solving** | 5% | End-to-end self-directed architecture, implementation of complex domain logic, defensive programming, and edge-case resolution. |
| **Total** | **100%** | **Targeting Grade: 100% Compliance across all evaluation dimensions.** |
