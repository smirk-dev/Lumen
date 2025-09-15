import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Download, Filter, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AddCourseDialog } from "./AddCourseDialog";
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

interface AcademicRecordsProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (courseCode: string) => void;
}

export function AcademicRecords({ courses, onAddCourse, onDeleteCourse }: AcademicRecordsProps) {
  const [filter, setFilter] = useState("all");
  
  const filteredCourses = courses.filter(course => {
    if (filter === "all") return true;
    if (filter === "completed") return course.status === "Completed";
    if (filter === "progress") return course.status === "In Progress";
    if (filter === "planned") return course.status === "Planned";
    if (filter === "fall") return course.semester.includes("Fall");
    if (filter === "spring") return course.semester.includes("Spring");
    return true;
  });

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const completedCourses = courses.filter(course => course.status === "Completed");
  const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const cumulativeGPA = completedCourses.length > 0 
    ? (completedCourses.reduce((sum, course) => sum + (course.gpa * course.credits), 0) / completedCredits).toFixed(2)
    : "0.00";

  const handleDelete = (courseCode: string, courseName: string) => {
    if (confirm(`Are you sure you want to delete "${courseCode} - ${courseName}"?`)) {
      onDeleteCourse(courseCode);
      toast.success("Course deleted successfully");
    }
  };

  const exportData = () => {
    const csvContent = [
      ["Course Code", "Course Name", "Semester", "Credits", "Grade", "GPA Points", "Status"],
      ...filteredCourses.map(course => [
        course.code, course.name, course.semester, course.credits, 
        course.grade, course.gpa, course.status
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "academic_records.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Academic records exported successfully");
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A") return "text-green-600 bg-green-100";
    if (grade === "A-") return "text-green-600 bg-green-100";
    if (grade === "B+") return "text-blue-600 bg-blue-100";
    if (grade === "B") return "text-blue-600 bg-blue-100";
    return "text-gray-600 bg-gray-100";
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed") return "text-green-600 bg-green-100";
    if (status === "In Progress") return "text-blue-600 bg-blue-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Academic Records ({filteredCourses.length}/{courses.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="fall">Fall Semester</SelectItem>
                <SelectItem value="spring">Spring Semester</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <AddCourseDialog onAddCourse={onAddCourse} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No courses found. {filter !== "all" ? "Try adjusting your filter or " : ""}Add your first course!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>GPA Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course, index) => (
                  <TableRow key={index} className="group">
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(course.grade)}>
                        {course.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.gpa}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => handleDelete(course.code, course.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-lg font-semibold">{totalCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cumulative GPA</p>
              <p className="text-lg font-semibold">{cumulativeGPA}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Credits</p>
              <p className="text-lg font-semibold">{completedCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits Remaining</p>
              <p className="text-lg font-semibold">{Math.max(0, 120 - completedCredits)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}