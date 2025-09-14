import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Trophy, Calendar, TrendingUp } from "lucide-react";
import type { Activity } from "../../App";

interface AdminStatsProps {
  activities: Activity[];
}

export function AdminStats({ activities }: AdminStatsProps) {
  const totalActivities = activities.length;
  const uniqueStudents = new Set(activities.map(a => a.studentId)).size;
  
  // Calculate this month's activities
  const now = new Date();
  const thisMonth = activities.filter(a => {
    const activityDate = new Date(a.date);
    return activityDate.getMonth() === now.getMonth() && 
           activityDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate activity types
  const uniqueTypes = new Set(activities.map(a => a.type)).size;

  const stats = [
    {
      title: "Total Activities",
      value: totalActivities,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Students",
      value: uniqueStudents,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "This Month",
      value: thisMonth,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Activity Types",
      value: uniqueTypes,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}