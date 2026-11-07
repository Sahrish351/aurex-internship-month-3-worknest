# WorkNest — Technical Implementation Report

## 1. System Engineering Highlights
WorkNest was developed following modern full-stack software engineering standards. The architecture enforces separation of concerns across presentation, routing, controller business logic, data persistence, and automated verification.

---

## 2. Frontend Engineering (React 18 + Vite + Tailwind CSS)
- **Component Decomposition:** Over 25 modular presentation and container components.
- **Client Routing:** `react-router-dom` v6 with layout nesting via `<Outlet />`.
- **Route Guards:**
  - `ProtectedRoute`: Verifies active session token before rendering protected views.
  - `RoleGuard`: Verifies user role before rendering administrative routes.
- **State Architecture:** React Context API (`AuthContext` and `ToastContext`) for predictable, lightweight state management.
- **Defensive API Client:** Axios instance with request token injection and 401 interceptors.
- **Kanban Drag-and-Drop:** Native HTML5 Drag and Drop API with optimistic UI updates and backend rollback.

---

## 3. Backend Engineering (Node.js + Express.js + Mongoose)
- **MVC Pattern:** Strict division between `routes/`, `controllers/`, and `models/`.
- **Security Pipeline:**
  - `helmet`: Security HTTP headers.
  - `cors`: Restricted cross-origin requests with credential support.
  - `express-rate-limit`: Brute-force throttling on authentication endpoints.
  - `express.json`: Body limit (20kb) preventing payload flooding attacks.
- **Centralized Error Handling:** Uniform error responses translating Mongoose CastErrors, duplicate key errors (`11000`), validation errors, and token errors without leaking internal stack traces.

---

## 4. Database Modeling & Integrity (MongoDB Atlas + Mongoose)
- **6 Interconnected Schemas:**
  - `User`: Email unique index, bcrypt password hashing pre-save hook, safe JSON transform.
  - `Project`: References `owner` (User) and `members` ([User]), date constraint validators.
  - `Task`: References `project` (Project), `assignedTo` (User), `createdBy` (User).
  - `Comment`: References `task` (Task) and `author` (User).
  - `Notification`: User alerts with unread indexing.
  - `ActivityLog`: Real-time audit trail.
- **Business Constraints:** Explicit referential validation preventing non-project members from receiving tasks; cascade deletion routines for child comments.
