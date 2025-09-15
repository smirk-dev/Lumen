import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays, Mail, Phone, MapPin, GraduationCap, BookOpen } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";

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

interface StudentProfileProps {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
}

export function StudentProfile({ profile, onUpdateProfile }: StudentProfileProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Profile</CardTitle>
        <EditProfileDialog profile={profile} onUpdateProfile={onUpdateProfile} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.major} Major</p>
              <Badge className="mt-2">{profile.year}</Badge>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Enrolled: {profile.enrollmentDate}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Expected Graduation: {profile.expectedGraduation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Student ID: {profile.studentId}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Academic Focus</h3>
              <div className="flex flex-wrap gap-2">
                {profile.academicFocus.map((focus, index) => (
                  <Badge key={index} variant="secondary">{focus}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Extracurricular Activities</h3>
              <div className="space-y-2">
                {profile.activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{activity.name}</span>
                    <Badge variant="outline">{activity.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}