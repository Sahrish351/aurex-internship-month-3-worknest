# WorkNest — Visual Interface & Demonstration Gallery

This directory contains the visual demonstration assets for the WorkNest Team Project & Task Management Platform submitted for the AUREX Full-Stack Engineering Internship (Month 3).

---

## Key Interface Views Documented

### 1. Public Marketing Landing Page (`/`)
- **Key Elements:** Editorial-inspired header, hero headline (*"Plan projects. Organize teams. Deliver work."*), interactive preview mockup, features overview, 3-step workflow, security architecture breakdown, and technical FAQ accordion.

### 2. User Authentication (`/login` & `/register`)
- **Key Elements:** Clean authentication card, password visibility toggles, real-time password strength meter, client-side validation feedback, and quick-fill demo evaluation buttons (Admin, Manager, Member).

### 3. Role-Governed Overview Dashboard (`/dashboard`)
- **Key Elements:**
  - **Admin View:** System-wide user statistics, active/completed project totals, total platform task velocity, and live `ActivityLog` audit feed.
  - **Manager View:** Managed workspace metrics, sprint velocity, overdue task alerts, and team member distribution.
  - **Member View:** Assigned tasks queue, completion rates, upcoming deadlines, and recent activity.

### 4. Project Directory & Workspace View (`/projects`, `/projects/:id`)
- **Key Elements:** Project card grid with progress bars, search and priority filters, project creation modal, team member invitation panel, and dedicated sprint Kanban board.

### 5. Interactive Sprint Kanban Board (`/tasks`)
- **Key Elements:** Drag-and-drop task workflow across four stages (`To Do`, `In Progress`, `In Review`, `Completed`), view mode toggle (Kanban vs. Table), task priority tags, assignee avatars, and task detail discussion modal.

### 6. User & Permissions Governance (`/admin/users`)
- **Key Elements:** Searchable user table, role elevation dropdowns (`member` $\longleftrightarrow$ `manager` $\longleftrightarrow$ `admin`), and account status toggles (`active` / `inactive`).

### 7. Profile & Security Settings (`/profile`)
- **Key Elements:** Personal details management, avatar preview, password modification with verification, and account summary.

---

## Capturing Additional Screenshots
To take high-resolution screenshots for mentor presentation slides:
1. Start the backend: `cd backend && npm run dev` (optionally run `npm run seed` first).
2. Start the frontend: `cd frontend && npm run dev`.
3. Open `http://localhost:5173` in Chrome or Edge and capture pages using Developer Tools (`Ctrl+Shift+P` $\longrightarrow$ `Capture full size screenshot`).

