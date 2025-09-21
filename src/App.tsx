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
  const clerkUser = null; // Fallback when Clerk is not available
  const isLoaded = true;   // Fallback when Clerk is not available
  
  // Try to use Clerk if available
  let actualClerkUser, actualIsLoaded;
  try {
    const clerkHook = useUser();
    actualClerkUser = clerkHook.user;
    actualIsLoaded = clerkHook.isLoaded;
  } catch (error) {
    console.warn("Clerk not available, using fallback", error);
    actualClerkUser = null;
    actualIsLoaded = true;
  }
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard');

  // Convert Clerk user to your User interface and handle role assignment
  useEffect(() => {
    if (actualIsLoaded && actualClerkUser) {
      // Check if user already exists in our users array
      const existingUser = users.find(u => u.email === actualClerkUser.primaryEmailAddress?.emailAddress);
      
      if (existingUser) {
        // Use existing user data with role information
        setCurrentUser(existingUser);
      } else {
        // Create new user with default student role
        const mappedUser: User = {
          id: actualClerkUser.id,
          name: actualClerkUser.fullName || `${actualClerkUser.firstName} ${actualClerkUser.lastName}` || 'User',
          email: actualClerkUser.primaryEmailAddress?.emailAddress || '',
          role: 'student',
          department: "Computer Science",
          year: "Senior",
          studentId: `CS${Date.now().toString().slice(-6)}`
        };
        setCurrentUser(mappedUser);
        setUsers(prev => [...prev, mappedUser]);
      }
    } else if (actualIsLoaded && !actualClerkUser) {
      // For development without Clerk, create a demo user
      if (!currentUser && users.length > 0) {
        setCurrentUser(users[0]); // Use first demo user
      }
    }
  }, [actualClerkUser, actualIsLoaded, users, currentUser]);

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

  // Activity management functions
  const addActivity = (activityData: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    
    try {
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }
  };

  const updateActivityStatus = (
    id: string, 
    status: Activity['status'], 
    comments?: string
  ) => {
    const updatedActivities = activities.map(activity => 
      activity.id === id 
        ? {
            ...activity,
            status,
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.name || 'Unknown',
            comments: comments || activity.comments
          }
        : activity
    );
    
    setActivities(updatedActivities);
    
    try {
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
    }
  };

  // User management functions
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, ...userData }
        : user
    );
    
    setUsers(updatedUsers);
    
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  };

  // Filter activities by status for different views
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const pendingActivities = activities.filter(a => a.status === 'pending');

  // Render section content
  const renderCurrentSection = () => {
    if (!currentUser) return null;

    switch (currentSection) {
      case 'dashboard':
        if (currentUser.role === 'student') {
          return (
            <StudentDashboard
              user={currentUser}
              activities={activities.filter(a => a.studentId === currentUser.studentId)}
              onAddActivity={addActivity}
            />
          );
        } else if (currentUser.role === 'faculty') {
          return (
            <FacultyDashboard
              user={currentUser}
              activities={pendingActivities}
              onUpdateActivityStatus={updateActivityStatus}
            />
          );
        } else if (currentUser.role === 'admin') {
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
        if (currentUser?.role === 'admin') {
          return (
            <UserManagementView
              users={users}
              onAddUser={addUser}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
            />
          );
        }
        break;
      
      case 'reports':
        return <ReportsView user={currentUser!} activities={activities} users={users} />;
      
      case 'settings':
        return <SettingsView user={currentUser!} />;
      
      case 'profile':
        if (currentUser?.role === 'student') {
          return (
            <StudentProfileView
              user={currentUser}
              activities={activities.filter(a => a.studentId === currentUser.studentId)}
            />
          );
        }
        break;
      
      case 'activities':
        if (currentUser?.role === 'student') {
          return (
            <StudentActivitiesView
              user={currentUser}
              activities={activities.filter(a => a.studentId === currentUser.studentId)}
              onAddActivity={addActivity}
            />
          );
        } else if (currentUser?.role === 'faculty') {
          return (
            <FacultyReviewView
              user={currentUser}
              activities={pendingActivities}
              onUpdateActivityStatus={updateActivityStatus}
            />
          );
        }
        break;
      
      case 'students':
        if (currentUser?.role === 'faculty') {
          return (
            <FacultyStudentsView
              user={currentUser}
              activities={activities}
              users={users.filter(u => u.role === 'student')}
            />
          );
        }
        break;
      
      case 'review':
        if (currentUser?.role === 'faculty') {
          return (
            <FacultyReviewView
              user={currentUser}
              activities={pendingActivities}
              onUpdateActivityStatus={updateActivityStatus}
            />
          );
        }
        break;
      
      default:
        return <div className="p-8 text-center">Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🎯 Lumen - Student Activity Platform</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Clerk Status:</span> {actualIsLoaded ? '✅ Loaded' : '⏳ Loading'}</p>
              <p><span className="font-medium">Clerk User:</span> {actualClerkUser ? `✅ ${actualClerkUser.fullName}` : '❌ None'}</p>
              <p><span className="font-medium">Current User:</span> {currentUser ? `✅ ${currentUser.name} (${currentUser.role})` : '❌ None'}</p>
            </div>
            <div>
              <p><span className="font-medium">Activities:</span> {activities.length} total</p>
              <p><span className="font-medium">Users:</span> {users.length} total</p>
              <p><span className="font-medium">Section:</span> {currentSection}</p>
            </div>
          </div>
        </div>

        {/* Show the appropriate content based on authentication */}
        {!actualClerkUser ? (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Development Mode</h3>
            <p className="text-blue-700 mb-4">Running without Clerk authentication. Using demo data.</p>
            {currentUser ? (
              <div className="bg-white p-4 rounded border">
                <p className="font-medium">Demo User: {currentUser.name}</p>
                <p className="text-sm text-gray-600">Role: {currentUser.role}</p>
                <div className="mt-4">
                  <button 
                    onClick={() => setCurrentSection('dashboard')}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setCurrentSection('activities')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                  >
                    Activities
                  </button>
                  <button 
                    onClick={() => setCurrentSection('analytics')}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    Analytics
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-red-600">No demo user available. Check data initialization.</p>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Authenticated Mode</h3>
            <p className="text-green-700">Signed in with Clerk: {actualClerkUser.fullName}</p>
          </div>
        )}

        {/* Render the actual dashboard content if we have a user */}
        {currentUser && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Dashboard Content</h3>
            {renderCurrentSection()}
          </div>
        )}
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
}