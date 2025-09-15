import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AddActivityDialog } from "./AddActivityDialog";
import { StudentStats } from "./StudentStats";
import { ActivityCard } from "./ActivityCard";
import { Plus, Clock, CheckCircle, XCircle, Trophy, User as UserIcon } from "lucide-react";
import type { User, Activity } from "../../App";

interface StudentDashboardProps {
  user: User;
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
}

export function StudentDashboard({ user, activities, onAddActivity }: StudentDashboardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const pendingActivities = activities.filter(a => a.status === 'pending');
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const rejectedActivities = activities.filter(a => a.status === 'rejected');

  const handleAddActivity = (activityData: any) => {
    onAddActivity({
      ...activityData,
      studentId: user.studentId!,
      studentName: user.name
    });
    setShowAddDialog(false);
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Submit your achievements and track their approval status.
        </p>
      </div>

      {/* Quick Stats */}
      <StudentStats activities={activities} />

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium">{user.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{user.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Academic Year</p>
              <p className="font-medium">{user.year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Activities ({activities.length})</TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              Pending ({pendingActivities.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved ({approvedActivities.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected ({rejectedActivities.length})
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Activity
          </Button>
        </div>

        <TabsContent value="all">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by submitting your first achievement or activity for verification.
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Activity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending activities</h3>
                  <p className="text-muted-foreground text-center">
                    All your submissions have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {approvedActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved activities</h3>
                  <p className="text-muted-foreground text-center">
                    Your approved achievements will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              approvedActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            {rejectedActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rejected activities</h3>
                  <p className="text-muted-foreground text-center">
                    Rejected submissions will appear here with feedback.
                  </p>
                </CardContent>
              </Card>
            ) : (
              rejectedActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddActivity}
      />
    </main>
  );
}