import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import type { Activity } from "../../App";

interface StudentStatsProps {
  activities: Activity[];
}

export function StudentStats({ activities }: StudentStatsProps) {
  const totalActivities = activities.length;
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const approvedActivities = activities.filter(a => a.status === 'approved').length;
  const rejectedActivities = activities.filter(a => a.status === 'rejected').length;

  const stats = [
    {
      title: "Total Submissions",
      value: totalActivities,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Review",
      value: pendingActivities,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Approved",
      value: approvedActivities,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Rejected",
      value: rejectedActivities,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
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