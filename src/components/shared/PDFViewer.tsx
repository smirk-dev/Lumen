import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FileText, Download, ZoomIn, ZoomOut, RotateCw, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PDFViewerProps {
  fileUrl?: string;
  fileName?: string;
  title: string;
  studentName: string;
  activityType: string;
  className?: string;
}

export function PDFViewer({ fileUrl, fileName, title, studentName, activityType, className }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we'll always show the mock PDF successfully
      // In production, you would handle real PDF loading here
    }, 800);

    return () => clearTimeout(timer);
  }, [fileUrl]);

  const handleDownload = () => {
    if (fileUrl) {
      // In a real app, this would download the actual file
      toast.success(`Downloading ${fileName || 'document.pdf'}...`);
    } else {
      // For demo, create a mock download
      const mockContent = `Mock PDF Content for ${title}\nStudent: ${studentName}\nType: ${activityType}`;
      const blob = new Blob([mockContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `${title.replace(/\s+/g, '_')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName || 'document.pdf'}`);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading PDF...</h3>
          <p className="text-muted-foreground text-center">
            Preparing {fileName || 'document'} for viewing
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load PDF</h3>
          <p className="text-muted-foreground text-center mb-4">
            The document could not be loaded. It may be corrupted or unavailable.
          </p>
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} flex flex-col h-full`}>
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {fileName || `${title}.pdf`}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{studentName}</span>
              <Badge variant="secondary">{activityType}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2 min-w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1">
        <div className="border-t bg-muted/30 h-full min-h-[500px] flex items-center justify-center overflow-auto">
          {/* Check if we have a real PDF URL */}
          {fileUrl && fileUrl.toLowerCase().endsWith('.pdf') ? (
            <div 
              className="w-full h-full min-h-[500px] flex items-center justify-center"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <iframe 
                src={fileUrl}
                className="w-full h-full border-0"
                title={`${fileName || title} PDF Viewer`}
                onError={() => setHasError(true)}
                style={{
                  minHeight: '500px',
                  maxWidth: '100%'
                }}
              />
            </div>
          ) : (
            /* Mock PDF viewer for demo purposes */
            <div
              className="bg-white shadow-lg border max-w-2xl mx-auto my-4 transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <div className="p-8 space-y-6 min-h-[500px]">
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                  <p className="text-gray-600 mt-2">Certificate of Achievement</p>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <p className="text-center text-lg">
                    This certifies that
                  </p>
                  
                  <p className="text-center text-2xl font-bold text-blue-600">
                    {studentName}
                  </p>
                  
                  <p className="text-center text-lg">
                    has successfully completed
                  </p>
                  
                  <p className="text-center text-xl font-semibold text-gray-800">
                    {title}
                  </p>
                  
                  <p className="text-center text-lg">
                    in the category of {activityType}
                  </p>
                  
                  <div className="flex justify-between items-end pt-12">
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-32 mb-1"></div>
                      <p className="text-sm">Date</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-32 mb-1"></div>
                      <p className="text-sm">Signature</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500 border-t pt-4">
                  Document ID: DOC-828082
                  <br />
                  Smart Student Hub - Academic Records Management
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}