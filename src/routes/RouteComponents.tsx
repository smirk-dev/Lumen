import React from 'react';
import { Navigate } from 'react-router-dom';
import { StudentDashboard } from '../components/student/StudentDashboard';
import { StudentProfileView } from '../components/student/StudentProfileView';
import { StudentActivitiesView } from '../components/student/StudentActivitiesView';
import { FacultyDashboard } from '../components/faculty/FacultyDashboard';
import { FacultyStudentsView } from '../components/faculty/FacultyStudentsView';
import { FacultyReviewView } from '../components/faculty/FacultyReviewView';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UserManagementView } from '../components/admin/UserManagementView';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { ReportsView } from '../components/reports/ReportsView';
import { SettingsView } from '../components/settings/SettingsView';
import type { User, Activity } from '../types';

interface RouteProps {
  currentUser: User;
  activities: Activity[];
  users: User[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
  onUpdateActivityStatus: (id: string, status: Activity['status'], comments?: string) => void;
  onAddUser: (userData: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

// Dashboard Routes
export const DashboardRoute: React.FC<RouteProps> = (props) => {
  const { currentUser } = props;
  
  switch (currentUser.role) {
    case 'student':
      return (
        <StudentDashboard
          user={currentUser}
          activities={props.activities.filter(a => a.studentId === currentUser.studentId)}
          onAddActivity={props.onAddActivity}
        />
      );
    case 'faculty':
      return (
        <FacultyDashboard
          user={currentUser}
          activities={props.activities.filter(a => a.status === 'pending')}
          onUpdateActivityStatus={props.onUpdateActivityStatus}
        />
      );
    case 'admin':
      return (
        <AdminDashboard
          user={currentUser}
          activities={props.activities.filter(a => a.status === 'approved')}
          users={props.users}
          onAddUser={props.onAddUser}
          onUpdateUser={props.onUpdateUser}
          onDeleteUser={props.onDeleteUser}
        />
      );
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

// Activities Routes
export const ActivitiesRoute: React.FC<RouteProps> = (props) => {
  const { currentUser } = props;
  
  if (currentUser.role === 'student') {
    return (
      <StudentActivitiesView
        user={currentUser}
        activities={props.activities.filter(a => a.studentId === currentUser.studentId)}
        onAddActivity={props.onAddActivity}
      />
    );
  } else if (currentUser.role === 'faculty') {
    return (
      <FacultyReviewView
        user={currentUser}
        activities={props.activities.filter(a => a.status === 'pending')}
        onUpdateActivityStatus={props.onUpdateActivityStatus}
      />
    );
  }
  
  return <Navigate to="/dashboard" replace />;
};

// Profile Routes
export const ProfileRoute: React.FC<RouteProps> = (props) => {
  const { currentUser } = props;
  
  if (currentUser.role === 'student') {
    return (
      <StudentProfileView
        user={currentUser}
        activities={props.activities.filter(a => a.studentId === currentUser.studentId)}
      />
    );
  }
  
  return <Navigate to="/dashboard" replace />;
};

// Students Routes (Faculty only)
export const StudentsRoute: React.FC<RouteProps> = (props) => {
  const { currentUser } = props;
  
  if (currentUser.role === 'faculty') {
    return (
      <FacultyStudentsView
        user={currentUser}
        activities={props.activities}
        users={props.users.filter(u => u.role === 'student')}
      />
    );
  }
  
  return <Navigate to="/unauthorized" replace />;
};

// User Management Routes (Admin only)
export const UserManagementRoute: React.FC<RouteProps> = (props) => {
  const { currentUser } = props;
  
  if (currentUser.role === 'admin') {
    return (
      <UserManagementView
        users={props.users}
        onAddUser={props.onAddUser}
        onUpdateUser={props.onUpdateUser}
        onDeleteUser={props.onDeleteUser}
      />
    );
  }
  
  return <Navigate to="/unauthorized" replace />;
};

// Analytics Routes
export const AnalyticsRoute: React.FC<RouteProps> = (props) => {
  return (
    <AnalyticsView
      user={props.currentUser}
      activities={props.activities}
      users={props.users}
    />
  );
};

// Reports Routes
export const ReportsRoute: React.FC<RouteProps> = (props) => {
  return (
    <ReportsView
      user={props.currentUser}
      activities={props.activities}
      users={props.users}
    />
  );
};

// Settings Routes
export const SettingsRoute: React.FC<RouteProps> = (props) => {
  return (
    <SettingsView
      user={props.currentUser}
    />
  );
};