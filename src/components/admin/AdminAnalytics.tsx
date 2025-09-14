import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import type { Activity } from "../../App";

interface AdminAnalyticsProps {
  activities: Activity[];
  detailed?: boolean;
}

export function AdminAnalytics({ activities, detailed = false }: AdminAnalyticsProps) {
  // Memoize expensive calculations to prevent performance issues
  const chartData = useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        typeChartData: [],
        monthlyChartData: [],
        topStudents: [],
        activityTypesData: {}
      };
    }

    // Activity types data
    const activityTypesData = activities.reduce((acc, activity) => {
      if (activity.type) {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const typeChartData = Object.entries(activityTypesData).map(([type, count]) => ({
      type,
      count
    }));

    // Monthly activities data
    const monthlyData = activities.reduce((acc, activity) => {
      try {
        const date = new Date(activity.date);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          acc[monthKey] = (acc[monthKey] || 0) + 1;
        }
      } catch (error) {
        console.warn('Invalid date:', activity.date);
      }
      return acc;
    }, {} as Record<string, number>);

    const monthlyChartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => {
        try {
          return {
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            count
          };
        } catch (error) {
          return { month: month, count };
        }
      });

    // Student activities data
    const studentData = activities.reduce((acc, activity) => {
      if (activity.studentName) {
        acc[activity.studentName] = (acc[activity.studentName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topStudents = Object.entries(studentData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        count
      }));

    return {
      typeChartData,
      monthlyChartData,
      topStudents,
      activityTypesData
    };
  }, [activities]);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Types Distribution</CardTitle>
            <CardDescription>
              Breakdown of approved activities by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.typeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="type" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Types Overview</CardTitle>
            <CardDescription>
              Visual distribution of activity categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.typeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.typeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {chartData.typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Trend</CardTitle>
              <CardDescription>
                Activity submissions over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.monthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <CardTitle>Most Active Students</CardTitle>
              <CardDescription>
                Students with the most approved activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.topStudents.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.topStudents} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>
            Key insights from student activities data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                {Object.keys(chartData.activityTypesData).length > 0 ? Math.max(...Object.values(chartData.activityTypesData)) : 0}
              </h3>
              <p className="text-sm text-blue-700">
                Most Popular: {Object.keys(chartData.activityTypesData).length > 0 ? 
                  Object.entries(chartData.activityTypesData).find(([,count]) => count === Math.max(...Object.values(chartData.activityTypesData)))?.[0] || 'None'
                  : 'None'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">
                {activities.length > 0 ? (activities.length / new Set(activities.map(a => a.studentId)).size).toFixed(1) : '0'}
              </h3>
              <p className="text-sm text-green-700">
                Avg Activities per Student
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">
                {Object.keys(chartData.activityTypesData).length}
              </h3>
              <p className="text-sm text-purple-700">
                Different Activity Types
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}