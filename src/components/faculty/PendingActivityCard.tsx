import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, CheckCircle, XCircle, FileText, Calendar, User, Eye } from "lucide-react";
import { PDFViewerDialog } from "../shared/PDFViewerDialog";
import type { Activity } from "../../App";

interface PendingActivityCardProps {
  activity: Activity;
  onReview: () => void;
  hideActions?: boolean;
}

export function PendingActivityCard({ activity, onReview, hideActions = false }: PendingActivityCardProps) {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const submittedDate = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <Card className={activity.status === 'pending' ? 'border-yellow-200 bg-yellow-50/50' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{activity.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {activity.studentName} ({activity.studentId})
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(activity.date)}
              </div>
              <Badge variant="outline">{activity.type}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(activity.status)}>
              {getStatusIcon(activity.status)}
              <span className="ml-1 capitalize">{activity.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{activity.description}</p>
        
        {activity.fileName && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">{activity.fileName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPDFViewer(true)}
              className="h-8"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Document
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Submitted: {formatDateTime(activity.submittedAt)} ({getDaysAgo(activity.submittedAt)})</span>
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

        {activity.comments && (
          <div className={`p-3 rounded-lg border ${
            activity.status === 'approved' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`text-sm font-medium mb-1 ${
              activity.status === 'approved' ? 'text-green-800' : 'text-red-800'
            }`}>
              {activity.status === 'approved' ? 'Comments:' : 'Rejection Reason:'}
            </h4>
            <p className={`text-sm ${
              activity.status === 'approved' ? 'text-green-700' : 'text-red-700'
            }`}>
              {activity.comments}
            </p>
          </div>
        )}

        {!hideActions && (
          <div className="flex gap-2 pt-2">
            <Button onClick={onReview} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Review & Decide
            </Button>
          </div>
        )}

        {hideActions && activity.status !== 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button onClick={onReview} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </CardContent>
      
      <PDFViewerDialog
        open={showPDFViewer}
        onOpenChange={setShowPDFViewer}
        activity={activity}
      />
    </Card>
  );
}