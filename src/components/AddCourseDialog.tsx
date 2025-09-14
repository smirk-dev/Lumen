import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Course {
  code: string;
  name: string;
  semester: string;
  credits: number;
  grade: string;
  gpa: number;
  status: string;
}

interface AddCourseDialogProps {
  onAddCourse: (course: Course) => void;
}

export function AddCourseDialog({ onAddCourse }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    semester: "",
    credits: "",
    grade: "",
    status: "In Progress",
  });

  const grades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];
  const semesters = ["Fall 2024", "Spring 2025", "Summer 2025", "Fall 2025"];
  const statuses = ["In Progress", "Completed", "Planned"];

  const getGpaFromGrade = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0
    };
    return gradeMap[grade] || 0.0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.semester || !formData.credits) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCourse: Course = {
      code: formData.code.toUpperCase(),
      name: formData.name,
      semester: formData.semester,
      credits: parseInt(formData.credits),
      grade: formData.grade || "TBD",
      gpa: formData.grade ? getGpaFromGrade(formData.grade) : 0,
      status: formData.status,
    };

    onAddCourse(newCourse);
    toast.success("Course added successfully!");
    
    setFormData({
      code: "",
      name: "",
      semester: "",
      credits: "",
      grade: "",
      status: "In Progress",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS 301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                placeholder="3"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Data Structures and Algorithms"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={formData.semester} onValueChange={(value: string) => setFormData({ ...formData, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: string) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Grade (Optional)</Label>
            <Select value={formData.grade} onValueChange={(value: string) => setFormData({ ...formData, grade: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade (if completed)" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}