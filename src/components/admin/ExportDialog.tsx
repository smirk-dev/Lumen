import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { FileText, Download, Table, Loader2 } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: 'csv' | 'pdf') => Promise<void>;
  activityCount: number;
}

export function ExportDialog({ open, onOpenChange, onExport, activityCount }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'csv' | 'pdf' | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportingFormat(format);
    
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Activities Report
          </DialogTitle>
          <DialogDescription>
            Choose your preferred format to export {activityCount} approved activities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV Export Option */}
          <Card 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              isExporting && exportingFormat === 'csv' ? 'opacity-50' : ''
            }`} 
            onClick={() => handleExport('csv')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
              <div className="rounded-full p-3 bg-green-100">
                {isExporting && exportingFormat === 'csv' ? (
                  <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                ) : (
                  <Table className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold">CSV Export</h3>
                <p className="text-sm text-muted-foreground">
                  {isExporting && exportingFormat === 'csv' ? 'Generating...' : 'Spreadsheet format for data analysis'}
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Excel compatible</li>
                <li>• Easy data manipulation</li>
                <li>• Quick download</li>
              </ul>
            </CardContent>
          </Card>

          {/* PDF Export Option */}
          <Card 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              isExporting && exportingFormat === 'pdf' ? 'opacity-50' : ''
            }`} 
            onClick={() => handleExport('pdf')}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
              <div className="rounded-full p-3 bg-blue-100">
                {isExporting && exportingFormat === 'pdf' ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold">PDF Report</h3>
                <p className="text-sm text-muted-foreground">
                  {isExporting && exportingFormat === 'pdf' ? 'Generating...' : 'Professional formatted report'}
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Print-ready format</li>
                <li>• Professional layout</li>
                <li>• Official reports</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}