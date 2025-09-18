import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import type { Activity } from "../../App";

interface StudentStatsProps {
  activities: Activity[];
}

export function StudentStats({ activities }: StudentStatsProps) {
  const isMobile = useIsMobile();
  const totalActivities = activities.length;
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const approvedActivities = activities.filter(a => a.status === 'approved').length;
  const rejectedActivities = activities.filter(a => a.status === 'rejected').length;

  const stats = [
    {
      title: "Total Submissions",
      shortTitle: "Total",
      value: totalActivities,
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Review",
      shortTitle: "Pending",
      value: pendingActivities,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Approved",
      shortTitle: "Approved",
      value: approvedActivities,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Rejected",
      shortTitle: "Rejected",
      value: rejectedActivities,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-all duration-200 hover:shadow-md active:scale-95 sm:active:scale-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              {isMobile ? stat.shortTitle : stat.title}
            </CardTitle>
            <div className={`rounded-full p-1.5 sm:p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
            {isMobile && (
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {stat.title !== stat.shortTitle && stat.title}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}