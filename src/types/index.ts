// ========================================
// CORE INTERFACES
// ========================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  year?: string;
  studentId?: string;
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  studentId: string;
  studentName: string;
  fileUrl?: string;
  fileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export type NavigationSection = 
  | 'dashboard' 
  | 'analytics' 
  | 'user-management' 
  | 'reports' 
  | 'settings'
  | 'profile'
  | 'activities'
  | 'students'
  | 'review';

// ========================================
// COMPONENT PROP INTERFACES
// ========================================

export interface StudentDashboardProps {
  user: User;
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
}

export interface FacultyDashboardProps {
  user: User;
  activities: Activity[];
  onUpdateActivityStatus: (id: string, status: Activity['status'], comments?: string) => void;
}

export interface AdminDashboardProps {
  user: User;
  activities: Activity[];
  users: User[];
  onAddUser: (userData: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities?: Activity[];
  users?: User[];
  currentUserRole?: UserRole;
  onNavigate?: (path: string) => void;
  onAction?: (actionId: string, payload?: any) => void;
}

export interface RoleHeaderProps {
  user: User;
  currentSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
}

// ========================================
// UTILITY TYPES
// ========================================

export type ActivityStatus = Activity['status'];
export type UserRole = User['role'];

export interface ActivityFormData {
  title: string;
  type: string;
  description: string;
  date: string;
  file?: File;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  year?: string;
  studentId?: string;
}

// ========================================
// FILTER AND SEARCH TYPES
// ========================================

export interface ActivityFilters {
  status?: ActivityStatus[];
  type?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  student?: string;
}

export interface SearchSuggestion {
  id: string;
  type: 'activity' | 'user';
  title: string;
  subtitle?: string;
  data: Activity | User;
}

// ========================================
// ERROR BOUNDARY TYPES
// ========================================

export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}