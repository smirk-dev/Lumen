import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { PDFViewer } from "./PDFViewer";
import type { Activity } from "../../App";

interface PDFViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
}

export function PDFViewerDialog({ open, onOpenChange, activity }: PDFViewerDialogProps) {
  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl">
            Document Viewer - {activity.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Viewing document submitted by {activity.studentName} for {activity.type} activity
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <PDFViewer
            fileUrl={activity.fileUrl}
            fileName={activity.fileName}
            title={activity.title}
            studentName={activity.studentName}
            activityType={activity.type}
            className="border-0 shadow-none h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}