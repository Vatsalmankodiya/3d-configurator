import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { user, isAuthenticated, isLoading, isAuthInitialized } = useAuthStore();

  // 1. Loading state while Firebase Auth initializes
  if (isLoading || !isAuthInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500 font-mono">
          Verifying authentication state...
        </p>
      </div>
    );
  }

  // 2. Redirect to Login if unauthenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Protect Admin routes: if route requires Admin and user role is not admin, redirect to User Website
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
