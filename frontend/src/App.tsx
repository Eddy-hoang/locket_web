import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './utils/routes';

// Pages
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { FriendsPage } from './pages/FriendsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PhotoManagement } from './pages/admin/PhotoManagement';
import { AdminLogs } from './pages/admin/AdminLogs';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.SIGNIN} replace />;
};

// Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return <>{children}</>;
};

// Public Route wrapper (redirect to home if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.HOME} replace />;
};

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  // Initialize auth on app start
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.SIGNUP}
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.SIGNIN}
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CHAT}
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.FRIENDS}
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_PHOTOS}
          element={
            <AdminRoute>
              <PhotoManagement />
            </AdminRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_LOGS}
          element={
            <AdminRoute>
              <AdminLogs />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;