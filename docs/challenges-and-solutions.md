# WorkNest — Technical Challenges & Solutions

## 1. Overview
Developing a multi-tier enterprise web application under strict industry specifications naturally surfaces technical constraints. Below is a structured analysis of the core challenges encountered during the development of WorkNest and the architectural solutions implemented to resolve them.

---

## 2. Challenge Log

### Challenge 1: Enforcing Strict Referential Integrity Across Relational Entities in MongoDB
- **Problem:** MongoDB is fundamentally schema-less and does not automatically reject tasks assigned to users who do not belong to the parent project, nor does it automatically cascade deletions of comments when a task is deleted.
- **Solution:** Implemented business validation at the controller and Mongoose hook layer. When creating or updating a task, the controller verifies that the target `assignedTo` ID is present in `project.members` or equals `project.owner`. In deletion handlers, explicit cascade routines (`Comment.deleteMany({ task: taskId })`) guarantee zero orphaned documents.

### Challenge 2: Optimistic UI vs. Backend Persistence on Kanban Drag-and-Drop
- **Problem:** When dragging a task card across Kanban columns, waiting for an asynchronous network roundtrip introduces perceptible latency, making the user interface feel sluggish. Conversely, updating the UI without error handling causes state desynchronization if the backend rejects the update (e.g. network disconnection or authorization failure).
- **Solution:** Implemented an optimistic update pattern with reversible state rollback. The React component immediately moves the task card in local state. If the asynchronous `PATCH /api/tasks/:id/status` request fails, the component automatically reverts the card to its original column and dispatches an error toast notification.

### Challenge 3: Eliminating Privilege Escalation on Public Registration
- **Problem:** Malicious users could tamper with network payloads by attaching `{ role: "admin" }` to the `/api/auth/register` POST body.
- **Solution:** The backend controller strictly ignores any client-supplied `role` parameter on public registration endpoints and hardcodes `role: 'member'`. Role promotions can only be performed by an authenticated administrator via the protected `PATCH /api/users/:id/role` route guarded by `authorize('admin')`.

### Challenge 4: Zero Secret Leakage Policy in Git Version Control
- **Problem:** AUREX Month 3 strictly forbids committing `.env` files, database credentials, or JWT secrets to GitHub repositories.
- **Solution:** Configured multi-level `.gitignore` rules in the repository root, `/backend`, and `/frontend`. Standardized all environment variables through `.env.example` templates, and implemented defensive fallback configuration inside `config/environment.js`.
