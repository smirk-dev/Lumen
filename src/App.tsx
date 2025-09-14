import { useState, useEffect } from "react";
import { LoginForm } from "./components/auth/LoginForm";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { FacultyDashboard } from "./components/faculty/FacultyDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { RoleHeader } from "./components/shared/RoleHeader";
import { Toaster } from "./components/ui/sonner";

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

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load user and activities from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedActivities = localStorage.getItem('activities');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setCurrentUser(parsedUser);
        }
      }
      
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
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      initializeSampleData();
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

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  };

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

  // If no user is logged in, show login form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <LoginForm onLogin={handleLogin} />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  // Render role-specific dashboard
  return (
    <div className="min-h-screen bg-background">
      <RoleHeader user={currentUser} onLogout={handleLogout} />
      
      {currentUser.role === 'student' && (
        <StudentDashboard 
          user={currentUser} 
          activities={activities.filter(a => a.studentId === currentUser.studentId) || []}
          onAddActivity={addActivity}
        />
      )}
      
      {currentUser.role === 'faculty' && (
        <FacultyDashboard 
          user={currentUser}
          activities={activities || []}
          onUpdateActivityStatus={updateActivityStatus}
        />
      )}
      
      {currentUser.role === 'admin' && (
        <AdminDashboard 
          user={currentUser}
          activities={activities.filter(a => a.status === 'approved') || []}
        />
      )}
      
      <Toaster position="bottom-right" />
    </div>
  );
}