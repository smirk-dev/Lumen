import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (activity: any) => void;
}

export function AddActivityDialog({ open, onOpenChange, onSubmit }: AddActivityDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    date: '',
    fileName: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const activityTypes = [
    'Workshop',
    'Certificate',
    'Competition',
    'Hackathon',
    'Conference',
    'Research',
    'Internship',
    'Project',
    'Volunteer Work',
    'Leadership',
    'Other'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      setSelectedFile(file);
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, fileName: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.description || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a proof document");
      return;
    }

    // In a real app, you would upload the file to a storage service
    // For this demo, we'll just store the filename
    const fileUrl = URL.createObjectURL(selectedFile);
    onSubmit({
      ...formData,
      fileName: selectedFile.name,
      fileUrl: fileUrl // Demo URL
    });
    
    // Clean up object URL after submission
    setTimeout(() => {
      URL.revokeObjectURL(fileUrl);
    }, 1000);

    // Reset form
    setFormData({
      title: '',
      type: '',
      description: '',
      date: '',
      fileName: ''
    });
    setSelectedFile(null);
    
    toast.success("Activity submitted successfully! It's now pending review.");
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      type: '',
      description: '',
      date: '',
      fileName: ''
    });
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit New Activity</DialogTitle>
          <DialogDescription>
            Submit your achievement or activity for verification. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title *</Label>
            <Input
              id="title"
              placeholder="e.g., React Development Workshop"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Activity Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Activity Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide details about your achievement or activity..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Proof Document *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload certificate, screenshot, or proof document
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    PDF, JPG, PNG files up to 10MB
                  </p>
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Submit Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}