import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { LoginForm } from '../components/auth/LoginForm';
import { RoleHeader } from '../components/shared/RoleHeader';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  DashboardRoute,
  ActivitiesRoute,
  ProfileRoute,
  StudentsRoute,
  UserManagementRoute,
  AnalyticsRoute,
  ReportsRoute,
  SettingsRoute,
} from './RouteComponents';
import ErrorBoundary from '../components/ErrorBoundary';
import type { User, Activity } from '../types';

interface AppRouterProps {
  currentUser: User | null;
  activities: Activity[];
  users: User[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
  onUpdateActivityStatus: (id: string, status: Activity['status'], comments?: string) => void;
  onAddUser: (userData: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

// Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <button 
        onClick={() => window.history.back()}
        className="text-blue-600 hover:text-blue-800"
      >
        Go back
      </button>
    </div>
  </div>
);

// Unauthorized Access Component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-8">You don't have permission to access this page</p>
      <button 
        onClick={() => window.history.back()}
        className="text-blue-600 hover:text-blue-800"
      >
        Go back
      </button>
    </div>
  </div>
);

// Layout Component with Header
const AppLayout: React.FC<{ children: React.ReactNode; currentUser: User }> = ({ 
  children, 
  currentUser 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <RoleHeader 
        user={currentUser} 
        onLogout={() => {}} // Clerk handles logout
        currentSection="dashboard" // This will be updated in full router integration
        onNavigate={() => {}} // This will be updated in full router integration
      />
      {children}
    </div>
  );
};

export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const { currentUser } = props;

  const routeProps = {
    ...props,
    currentUser: currentUser!,
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <SignedOut>
                <LoginForm />
              </SignedOut>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <SignedIn>
                {currentUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )}
              </SignedIn>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <DashboardRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/activities" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <ActivitiesRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <ProfileRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/students" 
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="faculty">
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <StudentsRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute currentUser={currentUser} requiredRole="admin">
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <UserManagementRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <AnalyticsRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <ReportsRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute currentUser={currentUser}>
                {currentUser && (
                  <AppLayout currentUser={currentUser}>
                    <SettingsRoute {...routeProps} />
                  </AppLayout>
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;