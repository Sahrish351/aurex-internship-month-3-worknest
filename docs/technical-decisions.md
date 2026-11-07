# WorkNest — Technical Decision Records (TDR)

## 1. Context & Architectural Principles
WorkNest is engineered to fulfill the requirements of the AUREX Month 3 Full-Stack Internship. The architectural decisions prioritize production readiness, defensive security, clean separation of concerns, and maintainability.

---

## 2. Decision Log

### Decision 1: Monorepo Architecture with Dedicated `/frontend` and `/backend`
- **Context:** AUREX requires an organized repository containing both client and server applications.
- **Decision:** Use a clean dual-directory structure (`frontend/` and `backend/`) within a unified Git repository.
- **Rationale:** Simplifies version control, synchronization of API contracts, unified CI/CD or independent deployment to Vercel (frontend) and Render/Railway (backend), while maintaining strict boundaries.

### Decision 2: React with Vite instead of Create React App or Next.js
- **Context:** AUREX specifies React.js SPA without Next.js-only backend blurring.
- **Decision:** Scaffold frontend using Vite with React 18+.
- **Rationale:** Vite provides instantaneous Hot Module Replacement (HMR), optimized Rollup production bundling, and zero deprecation warnings compared to legacy Create React App.

### Decision 3: Editorial SaaS Design Palette (Warm Ivory, Deep Forest Green)
- **Context:** User specified avoidance of generic AI-style dark cards, oversized gradients, or plain unstyled white templates.
- **Decision:** Implement a custom palette inspired by high-end productivity SaaS:
  - Base: Warm Ivory (`#FAF9F6`) & Soft White (`#FFFFFF`)
  - Accent/Primary: Deep Forest Green (`#173D32`) & Primary Green (`#286B52`)
  - Subtle Highlights: Light Sage (`#E7EFE9`), Muted Gray (`#747C77`), Soft Peach (`#E9A58C`)
  - Typography: Serif display headers paired with clean sans-serif UI text (DM Serif Display + Inter / DM Sans).
- **Rationale:** Creates a distinctive, calm, executive software aesthetic fitting for an enterprise collaboration suite.

### Decision 4: Express MVC Architecture with Centralized Middleware
- **Context:** Backend needs to be modular, scalable, and easy to test.
- **Decision:** Structure Express application into `controllers/`, `models/`, `routes/`, `middleware/`, and `config/`.
- **Rationale:** Avoids giant monolithic files; guarantees consistent error handling through an Express error middleware pipeline, preventing server crashes and unhandled promise rejections.

### Decision 5: Mongoose ODM with Referential Integrity
- **Context:** Relational data structures (Users, Projects, Tasks, Comments, Notifications, Activity Logs) inside MongoDB.
- **Decision:** Use Mongoose schemas with explicit `ref` fields, indexes on foreign keys, and pre-save/delete hooks.
- **Rationale:** Enforces schema validation at the application tier while taking advantage of MongoDB's fast read performance and aggregation capabilities.

### Decision 6: Stateless JWT Authentication with Role-Based Access Control (RBAC)
- **Context:** Need secure, stateless authorization across public, member, manager, and administrator operations.
- **Decision:** Issue signed JSON Web Tokens (JWT) upon login/register, verified via an `authenticate` middleware, followed by an `authorize(...roles)` guard.
- **Rationale:** Enables horizontal scaling, eliminates session storage bottlenecks, and cleanly enforces permission boundaries at the endpoint level.
