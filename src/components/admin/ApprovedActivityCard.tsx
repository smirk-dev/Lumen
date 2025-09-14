import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle, FileText, Calendar, User, Award, Eye } from "lucide-react";
import { PDFViewerDialog } from "../shared/PDFViewerDialog";
import type { Activity } from "../../App";

interface ApprovedActivityCardProps {
  activity: Activity;
}

export function ApprovedActivityCard({ activity }: ApprovedActivityCardProps) {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
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
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              {activity.title}
            </CardTitle>
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
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{activity.description}</p>
        
        {activity.fileName && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">{activity.fileName}</span>
            <Badge variant="secondary">
              Verified
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPDFViewer(true)}
              className="h-8"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Submitted: </span>
            <span className="font-medium">{formatDateTime(activity.submittedAt)}</span>
          </div>
          {activity.reviewedAt && (
            <div>
              <span className="text-muted-foreground">Approved: </span>
              <span className="font-medium">{formatDateTime(activity.reviewedAt)}</span>
            </div>
          )}
          {activity.reviewedBy && (
            <div>
              <span className="text-muted-foreground">Reviewed by: </span>
              <span className="font-medium">{activity.reviewedBy}</span>
            </div>
          )}
        </div>

        {activity.comments && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-1">Comments:</h4>
            <p className="text-sm text-green-700">{activity.comments}</p>
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