# WorkNest — REST API Documentation & Blueprint

## 1. General API Conventions
- **Base URL (Local):** `http://localhost:5000/api`
- **Base URL (Production):** `https://worknest-api.onrender.com/api` (or configured deployment URL)
- **Content-Type:** `application/json`
- **Authentication:** Bearer token via `Authorization: Bearer <JWT>` header (or secure HttpOnly cookie).
- **Uniform Error Response Structure:**
  ```json
  {
    "success": false,
    "error": {
      "message": "Human-readable explanation of error",
      "details": []
    }
  }
  ```
- **Uniform Success Response Structure:**
  ```json
  {
    "success": true,
    "message": "Optional descriptive message",
    "data": {}
  }
  ```

---

## 2. Authentication Endpoints (`/api/auth`)

### 1. Register User
- **Method:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Success (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "673f...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "member",
        "status": "active"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```
- **Errors:** `400 Bad Request` (validation error), `409 Conflict` (email already exists).

### 2. Login User
- **Method:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Success (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "673f...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "member"
      },
      "token": "eyJhbGci..."
    }
  }
  ```
- **Errors:** `400 Bad Request`, `401 Unauthorized` (invalid credentials or deactivated account).

### 3. Get Current Authenticated Profile
- **Method:** `GET /api/auth/me`
- **Access:** Authenticated (Any role)
- **Success (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "673f...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "member"
      }
    }
  }
  ```
- **Errors:** `401 Unauthorized` (missing/invalid token).

### 4. Change Password
- **Method:** `PATCH /api/auth/change-password`
- **Access:** Authenticated
- **Request Body:**
  ```json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword456!"
  }
  ```
- **Success (200 OK):**
  ```json
  { "success": true, "message": "Password changed successfully" }
  ```
- **Errors:** `400 Bad Request`, `401 Unauthorized` (incorrect current password).

---

## 3. Project Endpoints (`/api/projects`)

### 1. Create Project
- **Method:** `POST /api/projects`
- **Access:** Authenticated (`manager`, `admin`)
- **Request Body:**
  ```json
  {
    "title": "Website Redesign",
    "description": "Revamping enterprise website",
    "priority": "High",
    "status": "Active",
    "dueDate": "2026-12-15T00:00:00.000Z",
    "members": ["673f..."]
  }
  ```
- **Success (201 Created):** Returns populated project object.
- **Errors:** `400 Bad Request`, `403 Forbidden` (members cannot create projects).

### 2. List Projects
- **Method:** `GET /api/projects`
- **Access:** Authenticated (Filtered by user membership/ownership; Admins see all)
- **Query Params:** `status`, `priority`, `search`, `page`, `limit`
- **Success (200 OK):** Returns array of projects and pagination metadata.

### 3. Get Project by ID
- **Method:** `GET /api/projects/:id`
- **Access:** Authenticated (Must be owner, member, or admin)
- **Success (200 OK):** Returns project populated with owner, members, and task summary.
- **Errors:** `403 Forbidden`, `404 Not Found`.

### 4. Update Project
- **Method:** `PUT /api/projects/:id`
- **Access:** Authenticated (Project owner or `admin`)
- **Success (200 OK):** Returns updated project document.

### 5. Delete Project
- **Method:** `DELETE /api/projects/:id`
- **Access:** Authenticated (Project owner or `admin`)
- **Success (200 OK):** Returns `{ "success": true, "message": "Project deleted" }`.

### 6. Manage Project Members
- **Method:** `POST /api/projects/:id/members` & `DELETE /api/projects/:id/members/:userId`
- **Access:** Project owner or `admin`
- **Request Body (POST):** `{ "userId": "673f..." }`
- **Success (200 OK):** Returns updated project members array.

---

## 4. Task Endpoints (`/api/tasks`)

### 1. Create Task
- **Method:** `POST /api/tasks`
- **Access:** Project owner, manager, or member
- **Request Body:**
  ```json
  {
    "title": "Design Navigation Bar",
    "description": "Create accessible navigation components",
    "project": "673f...project_id",
    "assignedTo": "673f...user_id",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2026-12-01T00:00:00.000Z"
  }
  ```
- **Success (201 Created):** Returns populated task object.
- **Errors:** `400 Bad Request` (e.g. assignee not a member of project).

### 2. List Tasks
- **Method:** `GET /api/tasks`
- **Access:** Authenticated
- **Query Params:** `project`, `status`, `priority`, `assignedTo`, `search`
- **Success (200 OK):** Returns task array.

### 3. Update Task Status (Kanban Drag-and-Drop)
- **Method:** `PATCH /api/tasks/:id/status`
- **Access:** Authenticated (Assignee, project owner, or admin)
- **Request Body:** `{ "status": "In Progress" }`
- **Success (200 OK):** Returns updated task document.

### 4. Delete Task
- **Method:** `DELETE /api/tasks/:id`
- **Access:** Task creator, project owner, or admin
- **Success (200 OK):** Returns confirmation message and removes child comments.

---

## 5. Comment Endpoints (`/api/tasks/:id/comments`, `/api/comments/:id`)

### 1. Add Comment
- **Method:** `POST /api/tasks/:id/comments`
- **Access:** Authenticated (Project members)
- **Request Body:** `{ "text": "Drafted initial wireframe for review." }`
- **Success (201 Created):** Returns created comment with author details.

### 2. List Task Comments
- **Method:** `GET /api/tasks/:id/comments`
- **Access:** Authenticated (Project members)
- **Success (200 OK):** Returns chronological list of task comments.

### 3. Update / Edit Comment
- **Method:** `PUT /api/comments/:id`
- **Access:** Authenticated (Comment author or `admin` only)
- **Request Body:** `{ "text": "Updated discussion feedback and status." }`
- **Success (200 OK):** Returns updated comment document populated with author details.
- **Errors:** `400 Bad Request` (empty text), `403 Forbidden` (non-author/non-admin), `404 Not Found`.

### 4. Delete Comment
- **Method:** `DELETE /api/comments/:id`
- **Access:** Authenticated (Comment author or `admin` only)
- **Success (200 OK):** Returns deletion confirmation.

---

## 6. Notification Endpoints (`/api/notifications`)

### 1. Get User Notifications
- **Method:** `GET /api/notifications`
- **Access:** Authenticated
- **Success (200 OK):** Returns notifications array and unread count.

### 2. Mark Notification as Read
- **Method:** `PATCH /api/notifications/:id/read`
- **Access:** Authenticated (Owner of notification)
- **Success (200 OK):** Returns updated notification.

### 3. Mark All as Read
- **Method:** `PATCH /api/notifications/read-all`
- **Access:** Authenticated
- **Success (200 OK):** Returns `{ "success": true, "message": "All notifications marked as read" }`.

---

## 7. Dashboard Endpoints (`/api/dashboard`)

### 1. Get Role-Specific Metrics
- **Method:** `GET /api/dashboard/stats`
- **Access:** Authenticated
- **Behavior:**
  - **Admin:** System-wide aggregates (total users, active/completed projects, total tasks).
  - **Manager:** Manager-owned projects, pending tasks, overdue tasks, team member counts.
  - **Member:** Assigned tasks, completed tasks, overdue tasks, active assigned projects.
- **Success (200 OK):** Dynamic real-time metrics computed directly from MongoDB aggregations.

### 2. Get Recent Activity Feed
- **Method:** `GET /api/dashboard/activity`
- **Access:** Authenticated
- **Success (200 OK):** Returns chronological activity logs relevant to user.

---

## 8. User Management (Admin Only) (`/api/users`)
- `GET /api/users` — List and search platform users.
- `PATCH /api/users/:id/role` — Update user role (`admin`, `manager`, `member`).
- `PATCH /api/users/:id/status` — Activate or deactivate an account.
