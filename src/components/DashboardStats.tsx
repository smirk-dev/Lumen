import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { GraduationCap, Trophy, BookOpen, Target, TrendingUp, Calendar } from "lucide-react";

interface Course {
  code: string;
  name: string;
  semester: string;
  credits: number;
  grade: string;
  gpa: number;
  status: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  verified: boolean;
}

interface DashboardStatsProps {
  courses: Course[];
  achievements: Achievement[];
}

export function DashboardStats({ courses, achievements }: DashboardStatsProps) {
  const completedCourses = courses.filter(c => c.status === "Completed");
  const inProgressCourses = courses.filter(c => c.status === "In Progress");
  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const gpa = completedCourses.length > 0 
    ? (completedCourses.reduce((sum, course) => sum + (course.gpa * course.credits), 0) / totalCredits).toFixed(2)
    : "0.00";

  const stats = [
    {
      title: "Overall GPA",
      value: gpa,
      change: "+0.12",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Achievements",
      value: achievements.length.toString(),
      change: `${achievements.filter(a => a.verified).length} verified`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Courses Completed",
      value: completedCourses.length.toString(),
      change: `${totalCredits} credits`,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Current Courses",
      value: inProgressCourses.length.toString(),
      change: "Active",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </Badge>
              <span className="text-xs text-muted-foreground">vs last semester</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}