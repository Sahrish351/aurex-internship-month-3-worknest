import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-ivory">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-brand-muted font-sans">
            Verifying WorkNest session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
