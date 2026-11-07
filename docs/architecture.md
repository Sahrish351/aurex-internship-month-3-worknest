# WorkNest — System Architecture & Data Flow

## 1. Architectural Overview
WorkNest is built as a production-grade multi-tier web application adhering to the classic MERN (MongoDB, Express.js, React.js, Node.js) decoupled architecture. The frontend Single Page Application (SPA) communicates with the backend RESTful API over HTTPS/JSON, enforcing strict statelessness, role-based access control, and defensiveness.

```mermaid
flowchart TD
    subgraph Client ["Frontend Layer (React.js + Vite)"]
        UI["React Component Tree<br/>(Tailwind CSS + Lucide)"]
        Context["React Context API<br/>(AuthContext, ToastContext)"]
        Router["React Router DOM<br/>(ProtectedRoute & RoleGuard)"]
        AxiosClient["Axios HTTP Client<br/>(with Token Interceptors)"]
        
        UI --> Context
        UI --> Router
        Router --> AxiosClient
    end

    subgraph Network ["Transport Layer"]
        HTTPS["HTTPS / JSON REST Calls<br/>(CORS, Helmet, Rate Limiter)"]
    end

    subgraph Server ["Backend Layer (Node.js + Express.js)"]
        ExpressApp["Express Application"]
        Middleware["Security & Auth Middleware<br/>(authenticate, authorize, validate)"]
        Routes["Modular REST Routes<br/>(/api/auth, /api/projects, etc.)"]
        Controllers["MVC Controllers<br/>(Business Logic & Request Orchestration)"]
        Services["Domain Services & Helpers<br/>(Activity Logger, Notifier)"]
        ErrorHandler["Centralized Error Middleware<br/>(Consistent JSON Responses)"]

        ExpressApp --> Middleware
        Middleware --> Routes
        Routes --> Controllers
        Controllers --> Services
        Controllers --> ErrorHandler
    end

    subgraph Database ["Data Layer (MongoDB Atlas + Mongoose)"]
        MongooseModels["Mongoose ODM Models<br/>(Schemas, Indexes, Hooks)"]
        MongoDBAtlas[("MongoDB Atlas<br/>(Document Storage & Aggregation)")]

        Controllers --> MongooseModels
        MongooseModels --> MongoDBAtlas
    end

    AxiosClient -->|JSON Requests| HTTPS
    HTTPS -->|Filtered Traffic| ExpressApp
    MongoDBAtlas -->|BSON / Documents| MongooseModels
    MongooseModels -->|Hydrated Objects| Controllers
    Controllers -->|JSON Payloads| HTTPS
    HTTPS -->|Response Data| AxiosClient
```

---

## 2. Layer-by-Layer Architecture

### A. Frontend Layer (React 18 + Vite)
- **Component Hierarchy:** Decomposed into reusable presentation components (`Button`, `Card`, `Modal`, `Table`, `Badge`), domain-specific feature modules (`KanbanBoard`, `TaskCard`, `ProjectCard`, `ActivityFeed`), and route-level pages.
- **Routing & Navigation:** `react-router-dom` v6 manages public routes (`LandingPage`, `Login`, `Register`), protected routes requiring authentication (`Dashboard`, `Projects`, `Tasks`, `Profile`), and role-restricted guards (`AdminDashboard`).
- **State Management:** React Context API provides application-wide state for:
  - `AuthContext`: Holds current authenticated user, authentication status, and token lifecycle management.
  - `ToastContext`: Dispatches non-blocking notifications and status feedback.
- **HTTP Client:** Axios instance configured with `baseURL`, credentials support, and response interceptors to catch `401 Unauthorized` errors and automatically route users to login.

### B. Security & API Gateway Layer
- **CORS (Cross-Origin Resource Sharing):** Whitelists client origins in local and production environments, permitting credentialed exchanges.
- **Helmet:** Enforces secure HTTP response headers (`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`).
- **Rate Limiting:** Protects sensitive endpoints (e.g. `/api/auth/*`) against brute-force attacks via `express-rate-limit`.

### C. Backend Application Engine (Express.js + Node.js)
- **MVC Architecture:** Separation of routing (`routes/`), request processing & business rules (`controllers/`), data access & validation (`models/`), and cross-cutting concerns (`middleware/`).
- **Middleware Pipeline:**
  1. Body parsing (`express.json({ limit: '10kb' })`).
  2. Security headers & CORS.
  3. Authentication verification (`middleware/authenticate.js` verifies JWT signature and expiration).
  4. Role authorization (`middleware/authorize.js` ensures required roles: `admin`, `manager`, `member`).
  5. Request schema validation (`middleware/validateRequest.js`).
  6. Centralized error handling (`middleware/errorHandler.js` returns uniform JSON structures).

### D. Data Persistence Layer (Mongoose + MongoDB Atlas)
- **Mongoose ODM:** Defines schemas with strict type constraints, required fields, custom validators, pre-save hooks (e.g., bcrypt password hashing), and indexes.
- **Referential Document Integrity:** Models use `mongoose.Schema.Types.ObjectId` references (`ref`) in MongoDB to maintain clean entity relationships across Users, Projects, Tasks, Comments, Notifications, and Activity Logs.

---

## 3. Data & Authentication Flows

### A. User Authentication Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client Browser
    participant FE as React Frontend (AuthContext)
    participant API as Express API (/api/auth/login)
    participant DB as MongoDB Atlas (User Collection)

    User->>FE: Submits Email & Password
    FE->>API: POST /api/auth/login (JSON Body)
    API->>DB: Query User by Normalized Email
    DB-->>API: Returns User Document (with Password Hash)
    API->>API: Verify Password via bcrypt.compare()
    alt Credentials Invalid
        API-->>FE: 401 Unauthorized ("Invalid email or password")
        FE-->>User: Display Toast Error Message
    else Credentials Valid
        API->>API: Generate Signed JWT (Payload: id, role, email)
        API-->>FE: 200 OK + JWT Token + User Object
        FE->>FE: Store Token & Hydrate AuthContext
        FE-->>User: Redirect to Role-Specific Dashboard
    end
```

### B. Kanban Task Status Update Flow
```mermaid
sequenceDiagram
    autonumber
    actor Member as Team Member
    participant Kanban as React Kanban Component
    participant TaskAPI as Express API (PATCH /api/tasks/:id/status)
    participant Auth as Auth & RBAC Middleware
    participant TaskDB as MongoDB (Task & ActivityLog)

    Member->>Kanban: Drags Task from "In Progress" to "In Review"
    Kanban->>Kanban: Optimistic UI Update
    Kanban->>TaskAPI: PATCH /api/tasks/:id/status { status: "In Review" }
    TaskAPI->>Auth: Validate JWT & User Membership
    Auth-->>TaskAPI: User Authorized
    TaskAPI->>TaskDB: Update Task Status
    TaskAPI->>TaskDB: Insert ActivityLog Record
    TaskDB-->>TaskAPI: Updated Task Document
    TaskAPI-->>Kanban: 200 OK with Updated Task
    alt API Call Fails
        TaskAPI-->>Kanban: Error Status Code
        Kanban->>Kanban: Revert Task to "In Progress"
        Kanban-->>Member: Display Error Toast
    end
```
