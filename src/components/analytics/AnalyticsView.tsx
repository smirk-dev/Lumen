import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { BarChart3, TrendingUp, Users, Award, Calendar, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { User, Activity as ActivityType } from "../../App";

interface AnalyticsViewProps {
  user: User;
  activities: ActivityType[];
  users: User[];
}

export function AnalyticsView({ user, activities, users }: AnalyticsViewProps) {
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const pendingActivities = activities.filter(a => a.status === 'pending');
  const rejectedActivities = activities.filter(a => a.status === 'rejected');
  
  const students = users.filter(u => u.role === 'student');
  const faculty = users.filter(u => u.role === 'faculty');
  
  // Activity type distribution
  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(activityTypes).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Monthly activity trend (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', activities: 12, approved: 10 },
    { month: 'Feb', activities: 19, approved: 16 },
    { month: 'Mar', activities: 15, approved: 13 },
    { month: 'Apr', activities: 22, approved: 20 },
    { month: 'May', activities: 28, approved: 25 },
    { month: 'Jun', activities: 24, approved: 22 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const stats = [
    {
      title: "Total Activities",
      value: activities.length,
      icon: Activity,
      description: "All submitted activities",
      color: "bg-blue-500"
    },
    {
      title: "Approved Activities",
      value: approvedActivities.length,
      icon: Award,
      description: "Successfully reviewed",
      color: "bg-green-500"
    },
    {
      title: "Pending Review",
      value: pendingActivities.length,
      icon: Calendar,
      description: "Awaiting approval",
      color: "bg-yellow-500"
    },
    {
      title: "Active Students",
      value: students.length,
      icon: Users,
      description: "Registered students",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Live Data
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Trends
            </CardTitle>
            <CardDescription>
              Monthly activity submission and approval rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="activities" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Total Submissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Approved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
            <CardDescription>
              Distribution of activity categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      {user.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>
              Detailed breakdown of user activity and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{faculty.length}</div>
                <div className="text-sm text-muted-foreground">Faculty Members</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {approvedActivities.length > 0 ? (approvedActivities.length / activities.length * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}