import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { User, Users, Shield, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import type { User as UserType } from "../../App";

interface LoginFormProps {
  onLogin: (user: UserType) => void;
  users?: UserType[];
}

export function LoginForm({ onLogin, users = [] }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    studentId: ''
  });

  // Demo users for quick login
  const demoUsers = {
    student: {
      id: "1",
      name: "John Smith",
      email: "john.smith@university.edu",
      role: 'student' as const,
      department: "Computer Science",
      year: "Senior",
      studentId: "CS2022001"
    },
    faculty: {
      id: "2",
      name: "Dr. Emily Chen",
      email: "emily.chen@university.edu",
      role: 'faculty' as const,
      department: "Computer Science"
    },
    admin: {
      id: "3",
      name: "Michael Johnson",
      email: "michael.johnson@university.edu",
      role: 'admin' as const,
      department: "Administration"
    }
  };

  const handleDemoLogin = (role: keyof typeof demoUsers) => {
    const demoUser = demoUsers[role];
    
    // For students and faculty, check if they exist in the users database
    if (role !== 'admin') {
      const existingUser = users.find(user => 
        user.email === demoUser.email && user.role === role
      );
      
      if (!existingUser) {
        toast.error(`This ${role} account has not been created by an administrator. Please contact admin to create your account.`);
        return;
      }
      
      // Use the data from the database instead of demo data
      onLogin(existingUser);
      toast.success(`Logged in as ${existingUser.name} (${role})`);
    } else {
      // Admin can always log in with demo data
      onLogin(demoUser);
      toast.success(`Logged in as ${demoUser.name} (${role})`);
    }
  };

  const handleCustomLogin = () => {
    if (!selectedRole || !formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedRole !== 'admin') {
      toast.error("Only administrators can create new accounts");
      return;
    }

    const user: UserType = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: selectedRole,
      department: formData.department || 'Administration'
    };

    onLogin(user);
    toast.success(`Logged in as ${user.name} (${selectedRole})`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Smart Student Hub</h1>
          <p className="text-muted-foreground">
            Centralized platform for student achievement management and verification
          </p>
        </div>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleDemoLogin('student')}>
            <CardHeader className="text-center">
              <User className="h-8 w-8 mx-auto text-green-600" />
              <CardTitle className="text-lg">Student Demo</CardTitle>
              <CardDescription>Submit and track activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">John Smith</p>
                <Badge variant="secondary">CS Senior</Badge>
                <p className="text-sm text-muted-foreground">Student ID: CS2022001</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Login as Student</Button>
            </CardFooter>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleDemoLogin('faculty')}>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto text-blue-600" />
              <CardTitle className="text-lg">Faculty Demo</CardTitle>
              <CardDescription>Review and approve submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">Dr. Emily Chen</p>
                <Badge variant="secondary">Faculty</Badge>
                <p className="text-sm text-muted-foreground">Computer Science Dept.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Login as Faculty</Button>
            </CardFooter>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleDemoLogin('admin')}>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 mx-auto text-purple-600" />
              <CardTitle className="text-lg">Admin Demo</CardTitle>
              <CardDescription>Generate reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">Michael Johnson</p>
                <Badge variant="secondary">Administrator</Badge>
                <p className="text-sm text-muted-foreground">System Admin</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Login as Admin</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Login Help Text */}
        <div className="text-center max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Account Access Information</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Students & Faculty:</strong> Use the demo login cards above to access your accounts.</p>
              <p><strong>New Accounts:</strong> Only administrators can create new student and faculty accounts.</p>
              <p><strong>Administrators:</strong> Use the form below to create admin accounts or access user management.</p>
            </div>
          </div>
        </div>

        {/* Admin Login Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Admin-only account creation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {selectedRole === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g., Administration"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCustomLogin} className="w-full" disabled={selectedRole !== 'admin'}>
              Login as Admin
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}