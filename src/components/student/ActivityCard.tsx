import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, CheckCircle, XCircle, FileText, Calendar, AlertCircle, Eye } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import type { Activity } from "../../App";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const isMobile = useIsMobile();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'approved':
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return isMobile 
      ? date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md active:scale-[0.98] sm:active:scale-100">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg leading-tight">{activity.title}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{formatDate(activity.date)}</span>
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                {activity.type}
              </Badge>
            </div>
          </div>
          <Badge className={`${getStatusColor(activity.status)} shrink-0 text-xs`}>
            {getStatusIcon(activity.status)}
            <span className="ml-1 capitalize">{activity.status}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {activity.description}
        </p>
        
        {activity.fileName && (
          <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{activity.fileName}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View file</span>
            </Button>
          </div>
        )}

        {/* Timestamps - Mobile Stack Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <span>Submitted: {formatDateTime(activity.submittedAt)}</span>
          {activity.reviewedAt && (
            <span>Reviewed: {formatDateTime(activity.reviewedAt)}</span>
          )}
        </div>

        {activity.reviewedBy && (
          <div className="text-xs sm:text-sm">
            <span className="text-muted-foreground">Reviewed by: </span>
            <span className="font-medium">{activity.reviewedBy}</span>
          </div>
        )}

        {/* Feedback Section - Improved Mobile Layout */}
        {activity.comments && activity.status === 'rejected' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Feedback:</h4>
            <p className="text-sm text-red-700 leading-relaxed">{activity.comments}</p>
          </div>
        )}

        {activity.comments && activity.status === 'approved' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-1">Comments:</h4>
            <p className="text-sm text-green-700 leading-relaxed">{activity.comments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}