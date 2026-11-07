# WorkNest — 5-Minute Technical Presentation Script

## Presentation Metadata
- **Speaker:** Sahrish
- **Audience:** AUREX Mentor & Engineering Review Board
- **Duration:** 5 Minutes
- **Project:** WorkNest — Team Project & Task Management Platform

---

## 1. Opening & Project Problem Statement (Minute 1: 00:00 - 01:00)
> *"Hello everyone. Today I am presenting **WorkNest**, a full-stack team project and task management platform developed for the AUREX Full-Stack Engineering Internship Month 3 capstone.*
>
> *Modern cross-functional teams frequently struggle with fragmented communication, lack of accountability, and unorganized task tracking. Basic task apps are often single-role toy applications that do not reflect enterprise realities.*
>
> *WorkNest solves this by delivering an editorial-inspired SaaS platform featuring multi-role access control, persistent Kanban boards, referential database integrity, and real-time activity audit trails.*
>
> *Please note: WorkNest is my proposed capstone under AUREX's 'Task and Project Management' approved category, submitted today for formal mentor evaluation."*

---

## 2. System Architecture & Tech Stack (Minute 2: 01:00 - 02:00)
> *"WorkNest is built on a clean, decoupled MERN architecture:*
> - *The **Frontend** is built with React 18, Vite, and Tailwind CSS, featuring an editorial color palette (Warm Ivory, Forest Green, Light Sage) designed for clarity and reduced cognitive fatigue.*
> - *The **Backend** is an Express.js engine adhering to MVC separation of concerns with modular routes, dedicated controllers, and centralized error handling.*
> - *The **Data Layer** utilizes MongoDB with 6 interconnected Mongoose models: User, Project, Task, Comment, Notification, and ActivityLog.*
> - *The system is completely stateless, communicating via RESTful JSON APIs secured by JSON Web Tokens and bcrypt cryptographic hashing."*

---

## 3. Core Features & Live Demonstration (Minute 3: 02:00 - 03:30)
> *"Let's examine the three core workflows:*
> 1. *First, **Role-Based Access Control**: An Administrator has full oversight to manage accounts and change permissions. A Project Manager can create projects, add team members, and delegate tasks. A Team Member has focused visibility over their assigned items.*
> 2. *Second, **The Sprint Kanban Board**: Here we see an interactive board with To Do, In Progress, In Review, and Completed stages. When I drag this task across columns, the frontend updates optimistically while persisting a validated PATCH request to MongoDB and logging an audit entry.*
> 3. *Third, **Collaboration & Notifications**: When a manager reassigns a task or a member leaves a comment, an internal notification is dispatched in real-time to the recipient's notification center."*

---

## 4. Engineering Quality, Testing & Security (Minute 4: 03:30 - 04:30)
> *"A key focus of Month 3 is industry-grade engineering practices:*
> - *In **Testing**, I implemented an automated integration test suite with Jest and Supertest, achieving a 100% pass rate across health checks, validation rules, bcrypt hashing, JWT signing, and RBAC guards.*
> - *I also built a complete Postman collection with 20 documented requests covering both positive and negative edge cases.*
> - *For **Security**, we enforce zero-secret leakage: no plain-text passwords, zero `.env` commits, rate limiting on auth endpoints, and Helmet HTTP headers."*

---

## 5. Conclusion & Learning Outcomes (Minute 5: 04:30 - 05:00)
> *"Through building WorkNest, I moved from isolated coding exercises to architecting a complete, scalable full-stack web application from requirement analysis to production preparation.*
>
> *The code is clean, modular, fully documented, and ready for deployment on Vercel, Render, and MongoDB Atlas.*
>
> *Thank you, and I look forward to your questions and feedback."*
