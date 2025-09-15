import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, XCircle, FileText, Calendar, AlertCircle } from "lucide-react";
import type { Activity } from "../../App";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{activity.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(activity.date)}
              </div>
              <Badge variant="outline">{activity.type}</Badge>
            </div>
          </div>
          <Badge className={getStatusColor(activity.status)}>
            {getStatusIcon(activity.status)}
            <span className="ml-1 capitalize">{activity.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{activity.description}</p>
        
        {activity.fileName && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{activity.fileName}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Submitted: {formatDateTime(activity.submittedAt)}</span>
          {activity.reviewedAt && (
            <span>Reviewed: {formatDateTime(activity.reviewedAt)}</span>
          )}
        </div>

        {activity.reviewedBy && (
          <div className="text-sm">
            <span className="text-muted-foreground">Reviewed by: </span>
            <span className="font-medium">{activity.reviewedBy}</span>
          </div>
        )}

        {activity.comments && activity.status === 'rejected' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Feedback:</h4>
            <p className="text-sm text-red-700">{activity.comments}</p>
          </div>
        )}

        {activity.comments && activity.status === 'approved' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-1">Comments:</h4>
            <p className="text-sm text-green-700">{activity.comments}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}