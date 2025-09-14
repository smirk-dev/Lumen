import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { CheckCircle, XCircle, FileText, Calendar, User, AlertTriangle, Eye } from "lucide-react";
import { PDFViewerDialog } from "../shared/PDFViewerDialog";
import { toast } from "sonner";
import type { Activity } from "../../App";

interface ReviewActivityDialogProps {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (activityId: string, comments: string) => void;
  onReject: (activityId: string, comments: string) => void;
}

export function ReviewActivityDialog({ 
  activity, 
  open, 
  onOpenChange, 
  onApprove, 
  onReject 
}: ReviewActivityDialogProps) {
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const handleApprove = () => {
    if (activity.status !== 'pending') {
      toast.error("This activity has already been reviewed");
      return;
    }
    onApprove(activity.id, comments);
    toast.success("Activity approved successfully!");
    setComments('');
    setDecision(null);
  };

  const handleReject = () => {
    if (activity.status !== 'pending') {
      toast.error("This activity has already been reviewed");
      return;
    }
    if (!comments.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onReject(activity.id, comments);
    toast.success("Activity rejected with feedback provided");
    setComments('');
    setDecision(null);
  };

  const handleCancel = () => {
    setComments('');
    setDecision(null);
    onOpenChange(false);
  };

  const isReviewed = activity.status !== 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Review Activity Submission
          </DialogTitle>
          <DialogDescription>
            Review the details and decide whether to approve or reject this submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Details */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{activity.studentName} ({activity.studentId})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(activity.date)}</span>
                    </div>
                    <div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Submitted:</p>
                  <p className="text-sm font-medium">{formatDateTime(activity.submittedAt)}</p>
                  
                  {isReviewed && (
                    <>
                      <p className="text-sm text-muted-foreground">Reviewed:</p>
                      <p className="text-sm font-medium">{formatDateTime(activity.reviewedAt!)}</p>
                      <p className="text-sm text-muted-foreground">Reviewed by:</p>
                      <p className="text-sm font-medium">{activity.reviewedBy}</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>

              {activity.fileName && (
                <div>
                  <h4 className="font-medium mb-2">Proof Document</h4>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium flex-1">{activity.fileName}</span>
                    <Badge variant="secondary">
                      Attached
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
                </div>
              )}

              {isReviewed && activity.comments && (
                <div>
                  <h4 className="font-medium mb-2">
                    {activity.status === 'approved' ? 'Comments' : 'Rejection Reason'}
                  </h4>
                  <div className={`p-3 rounded-lg border ${
                    activity.status === 'approved' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <p className="text-sm">{activity.comments}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Status */}
          {isReviewed && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  {activity.status === 'approved' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    This activity has been {activity.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Section - Only show if pending */}
          {!isReviewed && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="comments">Comments (Optional for approval, Required for rejection)</Label>
                <Textarea
                  id="comments"
                  placeholder={
                    decision === 'reject' 
                      ? "Please provide a clear reason for rejection..." 
                      : "Add any comments or feedback for the student..."
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>

              {decision === 'reject' && !comments.trim() && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Rejection reason is required</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {isReviewed ? 'Close' : 'Cancel'}
          </Button>
          
          {!isReviewed && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setDecision('reject');
                  setTimeout(() => handleReject(), 100);
                }}
                disabled={decision === 'reject' && !comments.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={() => {
                  setDecision('approve');
                  setTimeout(() => handleApprove(), 100);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
      
      <PDFViewerDialog
        open={showPDFViewer}
        onOpenChange={setShowPDFViewer}
        activity={activity}
      />
    </Dialog>
  );
}