# WorkNest — Deployment & Hosting Guide

## 1. Cloud Hosting Architecture Overview
WorkNest is prepared for modern decoupled cloud deployment:
- **Frontend SPA:** Vercel Hosting (Static build + Client-side router rewrites)
- **Backend API:** Render or Railway (Node.js web service with Health Check)
- **Database:** MongoDB Atlas (M0 Free Tier or Dedicated Cluster)

---

## 2. Configuration Files Prepared in Repository
- `frontend/vercel.json`: Handles client-side SPA routing rewrites:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- `backend/render.yaml`: Defines service specifications, build commands, and environment variable requirements for Render.
- `/api/health`: Provides zero-downtime health monitoring for cloud load balancers.

---

## 3. Step-by-Step Deployment Instructions

### A. MongoDB Atlas Database Setup
1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (e.g. `worknest-cluster`).
3. Under **Database Access**, create a user (e.g. `worknest_app`) with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Copy the connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/worknest?retryWrites=true&w=majority`.

### B. Backend Deployment on Render
1. Connect your GitHub repository to [Render](https://render.com).
2. Select **Web Service** and point to root directory `backend/`.
3. Set Build Command: `npm install`.
4. Set Start Command: `node src/server.js`.
5. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Secure 32+ character key>`
   - `CLIENT_URL`: `<Your Vercel Frontend URL>`
6. Deploy and verify health check: `https://<render-subdomain>.onrender.com/api/health`.

### C. Frontend Deployment on Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend/`.
3. Framework Preset: **Vite**.
4. Set Environment Variables:
   - `VITE_API_URL`: `https://<render-subdomain>.onrender.com/api`
5. Deploy and verify full authentication and Kanban workflows.
