import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { UserPlus, User, Users, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import type { User as UserType } from "../../App";

interface UserManagementProps {
  users: UserType[];
  onAddUser: (user: Omit<UserType, 'id'>) => void;
  onUpdateUser: (userId: string, user: Partial<UserType>) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagement({ users, onAddUser, onUpdateUser, onDeleteUser }: UserManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as 'student' | 'faculty' | '',
    department: '',
    year: '',
    studentId: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      year: '',
      studentId: ''
    });
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role === 'student' && (!formData.department || !formData.year || !formData.studentId)) {
      toast.error("Please fill in all student information");
      return;
    }

    if (formData.role === 'faculty' && !formData.department) {
      toast.error("Please specify the faculty department");
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === formData.email)) {
      toast.error("A user with this email already exists");
      return;
    }

    // Check if student ID already exists for students
    if (formData.role === 'student' && users.some(user => user.studentId === formData.studentId)) {
      toast.error("A student with this ID already exists");
      return;
    }

    const newUser: Omit<UserType, 'id'> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.role === 'student' && {
        department: formData.department,
        year: formData.year,
        studentId: formData.studentId
      }),
      ...(formData.role === 'faculty' && {
        department: formData.department
      })
    };

    onAddUser(newUser);
    toast.success(`${formData.role} account created successfully for ${formData.name}`);
    resetForm();
    setShowAddDialog(false);
  };

  const handleEditUser = () => {
    if (!editingUser || !formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role === 'student' && (!formData.department || !formData.year || !formData.studentId)) {
      toast.error("Please fill in all student information");
      return;
    }

    if (formData.role === 'faculty' && !formData.department) {
      toast.error("Please specify the faculty department");
      return;
    }

    // Check if email already exists (excluding current user)
    if (users.some(user => user.email === formData.email && user.id !== editingUser.id)) {
      toast.error("A user with this email already exists");
      return;
    }

    // Check if student ID already exists for students (excluding current user)
    if (formData.role === 'student' && users.some(user => user.studentId === formData.studentId && user.id !== editingUser.id)) {
      toast.error("A student with this ID already exists");
      return;
    }

    const updatedUser: Partial<UserType> = {
      name: formData.name,
      email: formData.email,
      ...(formData.role === 'student' && {
        department: formData.department,
        year: formData.year,
        studentId: formData.studentId
      }),
      ...(formData.role === 'faculty' && {
        department: formData.department
      })
    };

    onUpdateUser(editingUser.id, updatedUser);
    toast.success(`User information updated successfully`);
    resetForm();
    setEditingUser(null);
  };

  const handleDeleteUser = (user: UserType) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      onDeleteUser(user.id);
      toast.success(`User ${user.name} deleted successfully`);
    }
  };

  const startEditUser = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role as 'student' | 'faculty',
      department: user.department || '',
      year: user.year || '',
      studentId: user.studentId || ''
    });
  };

  const studentUsers = users.filter(user => user.role === 'student');
  const facultyUsers = users.filter(user => user.role === 'faculty');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Create and manage student and faculty accounts</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User Account</DialogTitle>
              <DialogDescription>
                Add a new student or faculty member to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              {formData.role === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Computer Science"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="e.g., CS2022001"
                      value={formData.studentId}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {formData.role === 'faculty' && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facultyUsers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({studentUsers.length})</CardTitle>
          <CardDescription>Manage student accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {studentUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No students registered yet.</p>
          ) : (
            <div className="space-y-2">
              {studentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge variant="secondary">Student</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.department} • {user.year} • ID: {user.studentId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Faculty List */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty ({facultyUsers.length})</CardTitle>
          <CardDescription>Manage faculty accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {facultyUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No faculty members registered yet.</p>
          ) : (
            <div className="space-y-2">
              {facultyUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge variant="secondary">Faculty</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Account</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {formData.role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-year">Academic Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-studentId">Student ID</Label>
                  <Input
                    id="edit-studentId"
                    placeholder="e.g., CS2022001"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formData.role === 'faculty' && (
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  placeholder="e.g., Computer Science"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}