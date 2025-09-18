import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { GraduationCap, Users, Award, Search, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import type { User, Activity } from "../../App";

interface FacultyStudentsViewProps {
  users: User[];
  activities: Activity[];
}

export function FacultyStudentsView({ users, activities }: FacultyStudentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");

  const students = users.filter(u => u.role === 'student');
  const departments = [...new Set(students.filter(s => s.department).map(s => s.department!))];
  const years = [...new Set(students.filter(s => s.year).map(s => s.year!))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment;
    const matchesYear = filterYear === "all" || student.year === filterYear;
    return matchesSearch && matchesDepartment && matchesYear;
  });

  const getStudentStats = (studentId: string) => {
    const studentActivities = activities.filter(a => a.studentId === studentId);
    return {
      total: studentActivities.length,
      approved: studentActivities.filter(a => a.status === 'approved').length,
      pending: studentActivities.filter(a => a.status === 'pending').length,
      rejected: studentActivities.filter(a => a.status === 'rejected').length,
      latest: studentActivities.length > 0 ? 
        studentActivities.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0] :
        null
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students Overview</h1>
          <p className="text-muted-foreground">
            Monitor student activities and academic progress
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {filteredStudents.length} Students
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => {
                const stats = getStudentStats(s.studentId!);
                return stats.total > 0;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">With submissions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Different departments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
            <p className="text-xs text-muted-foreground">All submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>
            Search and filter students by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.studentId!);
          
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{student.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {student.studentId}
                      </Badge>
                      {student.year && (
                        <Badge variant="secondary" className="text-xs">
                          {student.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {student.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{student.department}</span>
                  </div>
                )}
                
                {/* Activity Stats */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Activity Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-semibold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{stats.approved}</div>
                      <div className="text-xs text-muted-foreground">Approved</div>
                    </div>
                  </div>
                  
                  {stats.pending > 0 && (
                    <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="font-semibold text-yellow-600">{stats.pending}</div>
                      <div className="text-xs text-muted-foreground">Pending Review</div>
                    </div>
                  )}
                </div>

                {/* Latest Activity */}
                {stats.latest && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">Latest Activity</h4>
                    <div className="space-y-1">
                      <div className="text-sm font-medium truncate">{stats.latest.title}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{stats.latest.type}</span>
                        <span>{format(new Date(stats.latest.submittedAt), 'MMM dd')}</span>
                      </div>
                      <Badge 
                        variant={stats.latest.status === 'approved' ? 'default' : 
                               stats.latest.status === 'rejected' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {stats.latest.status}
                      </Badge>
                    </div>
                  </div>
                )}

                {stats.total === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activities submitted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Students Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}