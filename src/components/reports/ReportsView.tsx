import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FileText, Download, Calendar, Award, Filter, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Activity, User } from "../../App";

interface ReportsViewProps {
  activities: Activity[];
  users: User[];
}

export function ReportsView({ activities, users }: ReportsViewProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === "all" || activity.type === filterType;
    
    const matchesPeriod = filterPeriod === "all" || (() => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      switch (filterPeriod) {
        case "thisMonth":
          return activityDate >= startOfMonth;
        case "thisYear":
          return activityDate >= startOfYear;
        case "lastMonth":
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
          return activityDate >= lastMonthStart && activityDate <= lastMonthEnd;
        default:
          return true;
      }
    })();
    
    const activityUser = users.find(u => u.studentId === activity.studentId);
    const matchesDepartment = filterDepartment === "all" || 
                             (activityUser && activityUser.department === filterDepartment);
    
    return matchesType && matchesPeriod && matchesDepartment;
  });

  const generateReport = () => {
    const reportData = filteredActivities.map(activity => {
      const user = users.find(u => u.studentId === activity.studentId);
      return {
        'Student Name': activity.studentName,
        'Student ID': activity.studentId,
        'Department': user?.department || 'N/A',
        'Activity Title': activity.title,
        'Activity Type': activity.type,
        'Date': format(new Date(activity.date), 'PPP'),
        'Status': activity.status,
        'Submitted At': format(new Date(activity.submittedAt), 'PPP'),
        'Reviewed By': activity.reviewedBy || 'N/A',
        'Comments': activity.comments || 'N/A'
      };
    });

    // Convert to CSV
    const headers = Object.keys(reportData[0] || {});
    const csv = [
      headers.join(','),
      ...reportData.map(row => 
        headers.map(header => 
          `"${(row as any)[header] || ''}"`
        ).join(',')
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activities_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  const activityTypes = [...new Set(activities.map(a => a.type))];
  const departments = [...new Set(users.filter(u => u.department).map(u => u.department!))];

  // Calculate summary statistics
  const totalActivities = filteredActivities.length;
  const uniqueStudents = new Set(filteredActivities.map(a => a.studentId)).size;
  const avgActivitiesPerStudent = uniqueStudents > 0 ? (totalActivities / uniqueStudents).toFixed(1) : "0";
  
  // Activity type breakdown
  const typeBreakdown = activityTypes.map(type => ({
    type,
    count: filteredActivities.filter(a => a.type === type).length
  })).sort((a, b) => b.count - a.count);

  // Department breakdown
  const departmentBreakdown = departments.map(dept => {
    const deptUsers = users.filter(u => u.department === dept && u.role === 'student');
    const deptActivities = filteredActivities.filter(a => {
      const user = users.find(u => u.studentId === a.studentId);
      return user?.department === dept;
    });
    
    return {
      department: dept,
      students: deptUsers.length,
      activities: deptActivities.length,
      avgPerStudent: deptUsers.length > 0 ? (deptActivities.length / deptUsers.length).toFixed(1) : "0"
    };
  }).sort((a, b) => b.activities - a.activities);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate detailed reports and insights
          </p>
        </div>
        <Button onClick={generateReport} disabled={filteredActivities.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueStudents}</div>
            <p className="text-xs text-muted-foreground">
              With submissions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Student</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgActivitiesPerStudent}</div>
            <p className="text-xs text-muted-foreground">
              Activities submitted
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Types</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              Different categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Customize your report by applying filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {activityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setFilterType("all");
                  setFilterPeriod("all");
                  setFilterDepartment("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Type Breakdown</CardTitle>
            <CardDescription>
              Distribution of activities by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typeBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <div className="font-medium">{item.count}</div>
                </div>
              ))}
              {typeBreakdown.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>
              Activity statistics by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentBreakdown.map((item) => (
                <div key={item.department} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{item.department}</Badge>
                    <div className="text-right text-sm">
                      <div className="font-medium">{item.activities} activities</div>
                      <div className="text-muted-foreground">
                        {item.students} students ({item.avgPerStudent} avg)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {departmentBreakdown.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No department data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Activity Report</CardTitle>
          <CardDescription>
            Complete list of activities matching your filters ({filteredActivities.length} results)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.slice(0, 50).map((activity) => {
                    const user = users.find(u => u.studentId === activity.studentId);
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.studentName}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.studentId} • {user?.department || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {activity.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{activity.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(activity.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={activity.status === 'approved' ? 'default' : 
                                   activity.status === 'rejected' ? 'destructive' : 'secondary'}
                          >
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {activity.reviewedBy || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredActivities.length > 50 && (
                <div className="p-4 text-center text-muted-foreground">
                  Showing first 50 results. Export full report to see all {filteredActivities.length} activities.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No activities found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}