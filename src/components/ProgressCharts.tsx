import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface Course {
  code: string;
  name: string;
  semester: string;
  credits: number;
  grade: string;
  gpa: number;
  status: string;
}

interface ProgressChartsProps {
  courses: Course[];
}

export function ProgressCharts({ courses }: ProgressChartsProps) {
  const completedCourses = courses.filter(c => c.status === "Completed");
  const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const degreeRequirement = 120; // Typical degree requirement
  const gpaData = [
    { semester: "Fall 2022", gpa: 3.2 },
    { semester: "Spring 2023", gpa: 3.4 },
    { semester: "Fall 2023", gpa: 3.6 },
    { semester: "Spring 2024", gpa: 3.7 },
    { semester: "Fall 2024", gpa: 3.85 },
  ];

  const creditsData = [
    { semester: "Fall 2022", credits: 15 },
    { semester: "Spring 2023", credits: 16 },
    { semester: "Fall 2023", credits: 18 },
    { semester: "Spring 2024", credits: 17 },
    { semester: "Fall 2024", credits: 16 },
  ];

  // Calculate grade distribution from actual data
  const gradeDistribution = completedCourses.reduce((acc, course) => {
    const existing = acc.find(item => item.grade === course.grade);
    if (existing) {
      existing.count++;
    } else {
      const colors = {
        "A": "#22c55e", "A-": "#65a30d", "B+": "#3b82f6", 
        "B": "#6366f1", "B-": "#8b5cf6", "C+": "#f59e0b",
        "C": "#f97316", "C-": "#ef4444", "D+": "#dc2626",
        "D": "#991b1b", "F": "#7f1d1d"
      };
      acc.push({ 
        grade: course.grade, 
        count: 1, 
        color: colors[course.grade as keyof typeof colors] || "#6b7280" 
      });
    }
    return acc;
  }, [] as Array<{ grade: string; count: number; color: string }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>GPA Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gpaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[3.0, 4.0]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credits per Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={creditsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="credits" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ grade, count }) => `${grade}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Degree Completion</span>
              <span className="text-sm font-medium">{Math.round((totalCredits / degreeRequirement) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((totalCredits / degreeRequirement) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">CS Major Courses</span>
              <span className="text-sm font-medium">{Math.round((completedCourses.filter(c => c.code.startsWith('CS')).length / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min((completedCourses.filter(c => c.code.startsWith('CS')).length / 15) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Math Requirements</span>
              <span className="text-sm font-medium">{Math.round((completedCourses.filter(c => c.code.startsWith('MATH')).length / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${Math.min((completedCourses.filter(c => c.code.startsWith('MATH')).length / 5) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Electives</span>
              <span className="text-sm font-medium">{Math.round((completedCourses.filter(c => !c.code.startsWith('CS') && !c.code.startsWith('MATH')).length / 8) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${Math.min((completedCourses.filter(c => !c.code.startsWith('CS') && !c.code.startsWith('MATH')).length / 8) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}