import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Edit, Plus, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface StudentProfile {
  name: string;
  major: string;
  year: string;
  email: string;
  phone: string;
  location: string;
  studentId: string;
  enrollmentDate: string;
  expectedGraduation: string;
  academicFocus: string[];
  activities: Array<{ name: string; role: string }>;
}

interface EditProfileDialogProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

export function EditProfileDialog({ profile, onUpdateProfile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newFocus, setNewFocus] = useState("");
  const [newActivity, setNewActivity] = useState({ name: "", role: "" });

  const yearOptions = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    toast.success("Profile updated successfully!");
    setOpen(false);
  };

  const addFocus = () => {
    if (newFocus.trim() && !formData.academicFocus.includes(newFocus.trim())) {
      setFormData({
        ...formData,
        academicFocus: [...formData.academicFocus, newFocus.trim()]
      });
      setNewFocus("");
    }
  };

  const removeFocus = (focus: string) => {
    setFormData({
      ...formData,
      academicFocus: formData.academicFocus.filter(f => f !== focus)
    });
  };

  const addActivity = () => {
    if (newActivity.name.trim() && newActivity.role.trim()) {
      setFormData({
        ...formData,
        activities: [...formData.activities, { ...newActivity }]
      });
      setNewActivity({ name: "", role: "" });
    }
  };

  const removeActivity = (index: number) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Select value={formData.year} onValueChange={(value: string) => setFormData({ ...formData, year: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollment">Enrollment Date</Label>
              <Input
                id="enrollment"
                value={formData.enrollmentDate}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="graduation">Expected Graduation</Label>
              <Input
                id="graduation"
                value={formData.expectedGraduation}
                onChange={(e) => setFormData({ ...formData, expectedGraduation: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Academic Focus Areas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.academicFocus.map((focus, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {focus}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeFocus(focus)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add focus area"
                value={newFocus}
                onChange={(e) => setNewFocus(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocus())}
              />
              <Button type="button" onClick={addFocus} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Extracurricular Activities</Label>
            <div className="space-y-2 mb-2">
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({activity.role})</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Activity name"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              />
              <Input
                placeholder="Role"
                value={newActivity.role}
                onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
              />
              <Button type="button" onClick={addActivity} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}