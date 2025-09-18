import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { SearchWithSuggestions } from "../shared/SearchWithSuggestions";
import { FilterChips } from "../shared/FilterChips";
import { UserPlus, Edit2, Trash2, Users, Shield, GraduationCap, Filter } from "lucide-react";
import { toast } from "sonner";
import { useSearch } from "../../hooks/useSearch";
import { useFilters, type FilterConfig } from "../../hooks/useFilters";
import type { User } from "../../App";

interface UserManagementViewProps {
  users: User[];
  onAddUser: (userData: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserManagementView({ users, onAddUser, onUpdateUser, onDeleteUser }: UserManagementViewProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "faculty" | "admin",
    department: "",
    year: "",
    studentId: ""
  });

  // Filter configuration for the enhanced filtering system
  const filterConfigs: FilterConfig[] = [
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'student', label: 'Students' },
        { value: 'faculty', label: 'Faculty' },
        { value: 'admin', label: 'Admins' }
      ]
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Departments' },
        ...Array.from(new Set(users.filter(u => u.department).map(u => u.department))).map(dept => ({
          value: dept!,
          label: dept!
        }))
      ]
    },
    {
      id: 'year',
      label: 'Academic Year',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Years' },
        { value: 'Freshman', label: 'Freshman' },
        { value: 'Sophomore', label: 'Sophomore' },
        { value: 'Junior', label: 'Junior' },
        { value: 'Senior', label: 'Senior' }
      ]
    }
  ];

  // Enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    filteredItems: searchFilteredUsers,
    searchSuggestions,
    searchHistory,
    clearHistory
  } = useSearch(users, {
    searchFields: ['name', 'email', 'studentId', 'department'],
    debounceMs: 200
  });

  // Enhanced filters hook
  const {
    filteredItems: finalFilteredUsers,
    activeFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    saveCurrentFilters,
    loadSavedFilter,
    deleteSavedFilter,
    savedFilters,
    filters
  } = useFilters(searchFilteredUsers, filterConfigs);

  const handleClearAllFilters = () => {
    setSearchTerm('');
    clearAllFilters();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "student",
      department: "",
      year: "",
      studentId: ""
    });
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department || undefined,
      year: formData.year || undefined,
      studentId: formData.studentId || undefined
    };

    onAddUser(userData);
    setShowAddDialog(false);
    resetForm();
    toast.success("User added successfully");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      year: user.year || "",
      studentId: user.studentId || ""
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser || !formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department || undefined,
      year: formData.year || undefined,
      studentId: formData.studentId || undefined
    };

    onUpdateUser(editingUser.id, userData);
    setEditingUser(null);
    resetForm();
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDeleteUser(user.id);
      toast.success("User deleted successfully");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'faculty':
        return <Users className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const UserFormDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
    <Dialog open={isEdit ? !!editingUser : showAddDialog} onOpenChange={isEdit ? () => setEditingUser(null) : setShowAddDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user information' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: "student" | "faculty" | "admin") => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              placeholder="Enter department"
            />
          </div>
          
          {formData.role === 'student' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  placeholder="Enter student ID"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            if (isEdit) {
              setEditingUser(null);
            } else {
              setShowAddDialog(false);
            }
            resetForm();
          }}>
            Cancel
          </Button>
          <Button onClick={isEdit ? handleUpdateUser : handleAddUser}>
            {isEdit ? 'Update User' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'faculty').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Enhanced User Search & Filter
          </CardTitle>
          <CardDescription>
            Search and filter user accounts with advanced options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Search and Bulk Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <SearchWithSuggestions
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={setSearchTerm}
                placeholder="Search users by name, email, student ID, or department..."
                suggestions={searchSuggestions}
                searchHistory={searchHistory}
                onClearHistory={clearHistory}
                maxSuggestions={6}
                maxHistory={4}
              />
            </div>
            
            {/* Bulk Actions (Future Enhancement) */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Users className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students ({users.filter(u => u.role === 'student').length})</SelectItem>
                <SelectItem value="faculty">Faculty ({users.filter(u => u.role === 'faculty').length})</SelectItem>
                <SelectItem value="admin">Admins ({users.filter(u => u.role === 'admin').length})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Array.from(new Set(users.filter(u => u.department).map(u => u.department))).map(dept => (
                  <SelectItem key={dept} value={dept!}>
                    {dept} ({users.filter(u => u.department === dept).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="Freshman">Freshman ({users.filter(u => u.year === 'Freshman').length})</SelectItem>
                <SelectItem value="Sophomore">Sophomore ({users.filter(u => u.year === 'Sophomore').length})</SelectItem>
                <SelectItem value="Junior">Junior ({users.filter(u => u.year === 'Junior').length})</SelectItem>
                <SelectItem value="Senior">Senior ({users.filter(u => u.year === 'Senior').length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Chips */}
          <FilterChips
            activeFilters={activeFilters}
            savedFilters={savedFilters}
            onClearFilter={clearFilter}
            onClearAllFilters={handleClearAllFilters}
            onSaveFilters={saveCurrentFilters}
            onLoadSavedFilter={loadSavedFilter}
            onDeleteSavedFilter={deleteSavedFilter}
            showSaveFilters={true}
          />

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Additional Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finalFilteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>
                      {user.role === 'student' && (
                        <div className="text-sm">
                          {user.year && <div>Year: {user.year}</div>}
                          {user.studentId && <div>ID: {user.studentId}</div>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {finalFilteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog />
      {editingUser && <UserFormDialog isEdit />}
    </div>
  );
}