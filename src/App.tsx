import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { LoginForm } from "./components/auth/LoginForm";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { FacultyDashboard } from "./components/faculty/FacultyDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RoleHeader } from "./components/shared/RoleHeader";
import { Toaster } from "./components/ui/sonner";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { UserManagementView } from "./components/admin/UserManagementView";
import { ReportsView } from "./components/reports/ReportsView";
import { SettingsView } from "./components/settings/SettingsView";
import { StudentProfileView } from "./components/student/StudentProfileView";
import { StudentActivitiesView } from "./components/student/StudentActivitiesView";
import { FacultyStudentsView } from "./components/faculty/FacultyStudentsView";
import { FacultyReviewView } from "./components/faculty/FacultyReviewView";
import ErrorBoundary from "./components/ErrorBoundary";
import type { User, Activity, NavigationSection } from "./types";

export default function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard');

  // Convert Clerk user to your User interface and handle role assignment
  useEffect(() => {
    if (isLoaded && clerkUser) {
      // Check if user already exists in our users array
      const existingUser = users.find(u => u.email === clerkUser.primaryEmailAddress?.emailAddress);
      
      if (existingUser) {
        // Use existing user data with role information
        setCurrentUser(existingUser);
      } else {
        // Create new user with default student role
        // In a real app, you'd set roles via Clerk metadata or your backend
        const mappedUser: User = {
          id: clerkUser.id,
          name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}` || 'User',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          role: 'student', // Default role - can be customized via Clerk metadata
          department: "Computer Science", // Can be set via Clerk metadata
          year: "Senior", // Can be set via Clerk metadata
          studentId: `CS${Date.now().toString().slice(-6)}` // Generate or get from metadata
        };
        setCurrentUser(mappedUser);
        
        // Add new user to users array
        setUsers(prev => [...prev, mappedUser]);
      }
    } else if (isLoaded && !clerkUser) {
      // User is signed out
      setCurrentUser(null);
    }
  }, [clerkUser, isLoaded, users]);

  // Initialize data on mount
  useEffect(() => {
    try {
      const savedActivities = localStorage.getItem('activities');
      const savedUsers = localStorage.getItem('users');
      
      if (savedActivities) {
        const parsedActivities = JSON.parse(savedActivities);
        if (Array.isArray(parsedActivities)) {
          setActivities(parsedActivities);
        } else {
          initializeSampleData();
        }
      } else {
        initializeSampleData();
      }

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) {
          setUsers(parsedUsers);
        } else {
          initializeSampleUsers();
        }
      } else {
        initializeSampleUsers();
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      initializeSampleData();
      initializeSampleUsers();
    }
  }, []);

  const initializeSampleData = () => {
    const sampleActivities: Activity[] = [
      {
        id: "1",
        title: "React Workshop Completion",
        type: "Workshop",
        description: "Completed advanced React development workshop covering hooks, context, and performance optimization",
        date: "2024-12-15",
        studentId: "CS2022001",
        studentName: "John Smith",
        fileName: "react_workshop_certificate.pdf",
        status: "pending",
        submittedAt: "2024-12-16T10:30:00Z"
      },
      {
        id: "2",
        title: "Machine Learning Certification",
        type: "Certificate",
        description: "Completed online certification in Machine Learning fundamentals from Stanford University",
        date: "2024-11-28",
        studentId: "CS2022002",
        studentName: "Sarah Johnson",
        fileName: "ml_certificate.pdf",
        status: "approved",
        submittedAt: "2024-11-29T14:20:00Z",
        reviewedAt: "2024-11-30T09:15:00Z",
        reviewedBy: "Dr. Emily Chen",
        comments: "Excellent work! This certification demonstrates strong understanding of ML concepts."
      },
      {
        id: "3",
        title: "Hackathon Winner",
        type: "Competition",
        description: "First place in university-wide hackathon for developing sustainable transportation app",
        date: "2024-12-01",
        studentId: "CS2022001",
        studentName: "John Smith",
        fileName: "hackathon_winner_certificate.pdf",
        status: "approved",
        submittedAt: "2024-12-02T16:45:00Z",
        reviewedAt: "2024-12-03T11:30:00Z",
        reviewedBy: "Prof. Michael Brown",
        comments: "Outstanding achievement! The app shows great innovation and technical skills."
      },
      {
        id: "4",
        title: "AWS Cloud Practitioner Certification",
        type: "Certificate",
        description: "Successfully passed AWS Cloud Practitioner certification exam, demonstrating foundational cloud computing knowledge",
        date: "2024-12-10",
        studentId: "CS2022003",
        studentName: "Emily Davis",
        fileName: "aws_cloud_practitioner_cert.pdf",
        status: "pending",
        submittedAt: "2024-12-11T09:15:00Z"
      },
      {
        id: "5",
        title: "International Programming Contest",
        type: "Competition",
        description: "Participated in ACM ICPC regional programming contest, solved 4 out of 8 problems",
        date: "2024-11-15",
        studentId: "CS2022002",
        studentName: "Sarah Johnson",
        fileName: "icpc_participation_certificate.pdf",
        status: "approved", 
        submittedAt: "2024-11-16T14:30:00Z",
        reviewedAt: "2024-11-17T10:45:00Z",
        reviewedBy: "Dr. Emily Chen",
        comments: "Great performance in a competitive environment. This shows excellent problem-solving skills."
      }
    ];
    setActivities(sampleActivities);
    try {
      localStorage.setItem('activities', JSON.stringify(sampleActivities));
    } catch (error) {
      console.error('Error saving sample data to localStorage:', error);
    }
  };

  const initializeSampleUsers = () => {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@university.edu",
        role: 'student',
        department: "Computer Science",
        year: "Senior",
        studentId: "CS2022001"
      },
      {
        id: "2",
        name: "Dr. Emily Chen",
        email: "emily.chen@university.edu",
        role: 'faculty',
        department: "Computer Science"
      },
      {
        id: "3",
        name: "Michael Johnson",
        email: "michael.johnson@university.edu",
        role: 'admin',
        department: "Administration"
      },
      {
        id: "4",
        name: "Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: 'student',
        department: "Computer Science",
        year: "Junior",
        studentId: "CS2022002"
      },
      {
        id: "5",
        name: "Emily Davis",
        email: "emily.davis@university.edu",
        role: 'student',
        department: "Computer Science",
        year: "Sophomore",
        studentId: "CS2022003"
      }
    ];
    setUsers(sampleUsers);
    try {
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    } catch (error) {
      console.error('Error saving sample users to localStorage:', error);
    }
  };

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      try {
        localStorage.setItem('activities', JSON.stringify(activities));
      } catch (error) {
        console.error('Error saving activities to localStorage:', error);
      }
    }
  }, [activities]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error('Error saving users to localStorage:', error);
      }
    }
  }, [users]);

  const addActivity = (activityData: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const updateActivityStatus = (activityId: string, status: 'approved' | 'rejected', comments?: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            status, 
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.name,
            comments 
          }
        : activity
    ));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    // Also remove activities for deleted students
    setActivities(prev => prev.filter(activity => {
      const user = users.find(u => u.id === userId);
      return !(user?.role === 'student' && activity.studentId === user.studentId);
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const renderCurrentSection = () => {
    const studentActivities = activities.filter(a => a.studentId === currentUser?.studentId) || [];
    const approvedActivities = activities.filter(a => a.status === 'approved') || [];

    switch (currentSection) {
      case 'dashboard':
        if (currentUser?.role === 'student') {
          return (
            <StudentDashboard 
              user={currentUser} 
              activities={studentActivities}
              onAddActivity={addActivity}
            />
          );
        } else if (currentUser?.role === 'faculty') {
          return (
            <FacultyDashboard 
              activities={activities}
              onUpdateActivityStatus={updateActivityStatus}
            />
          );
        } else if (currentUser?.role === 'admin') {
          return (
            <AdminDashboard 
              user={currentUser}
              activities={approvedActivities}
              users={users}
              onAddUser={addUser}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
            />
          );
        }
        break;
      
      case 'analytics':
        return <AnalyticsView user={currentUser!} activities={activities} users={users} />;
      
      case 'user-management':
        return (
          <UserManagementView 
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        );
      
      case 'reports':
        return <ReportsView activities={approvedActivities} users={users} />;
      
      case 'settings':
        return <SettingsView user={currentUser!} onUpdateUser={(userData) => updateUser(currentUser!.id, userData)} />;
      
      case 'profile':
        return <StudentProfileView user={currentUser!} activities={studentActivities} />;
      
      case 'activities':
        return (
          <StudentActivitiesView 
            user={currentUser!}
            activities={studentActivities}
            onAddActivity={addActivity}
          />
        );
      
      case 'students':
        return <FacultyStudentsView users={users.filter(u => u.role === 'student')} activities={activities} />;
      
      case 'review':
        return (
          <FacultyReviewView 
            activities={activities}
            onUpdateActivityStatus={updateActivityStatus}
          />
        );
      
      default:
        return <div className="p-8 text-center">Section not found</div>;
    }
  };

  // Render role-specific dashboard
  return (
    <div className="min-h-screen bg-background">
      <SignedOut>
        <LoginForm />
      </SignedOut>
      
      <SignedIn>
        {currentUser && (
          <>
            <RoleHeader 
              user={currentUser} 
              onLogout={() => {}} // Clerk handles logout
              currentSection={currentSection}
              onNavigate={setCurrentSection}
            />
            
            {renderCurrentSection()}
          </>
        )}
      </SignedIn>
      
      <Toaster position="bottom-right" />
    </div>
  );
}