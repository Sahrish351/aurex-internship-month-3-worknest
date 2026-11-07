import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { AppLayout } from '../components/layout/AppLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Protected Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { ProjectListPage } from '../pages/projects/ProjectListPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { ProfilePage } from '../pages/member/ProfilePage';

// Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { UnauthorizedPage } from '../pages/errors/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing & Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Workspace Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/admin/users"
          element={
            <RoleGuard allowedRoles={['admin', 'manager']}>
              <UserManagementPage />
            </RoleGuard>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
