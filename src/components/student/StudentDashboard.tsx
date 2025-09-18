import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AddActivityDialog } from "./AddActivityDialog";
import { StudentStats } from "./StudentStats";
import { ActivityCard } from "./ActivityCard";
import { Plus, Clock, CheckCircle, XCircle, Trophy, User as UserIcon } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import type { User, Activity } from "../../App";

interface StudentDashboardProps {
  user: User;
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
}

export function StudentDashboard({ user, activities, onAddActivity }: StudentDashboardProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const isMobile = useIsMobile();

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
    <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Submit your achievements and track their approval status.
        </p>
      </div>

      {/* Quick Stats */}
      <StudentStats activities={activities} />

      {/* Profile Card - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium text-sm sm:text-base">{user.studentId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Department</p>
              <p className="font-medium text-sm sm:text-base">{user.department}</p>
            </div>
            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Academic Year</p>
              <p className="font-medium text-sm sm:text-base">{user.year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs - Mobile Optimized */}
      <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Mobile-friendly TabsList with scroll */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 min-w-max sm:min-w-0">
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                All ({activities.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Pending</span>
                <span className="sm:hidden">Pend.</span>
                ({pendingActivities.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Approved</span>
                <span className="sm:hidden">Appr.</span>
                ({approvedActivities.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Rejected</span>
                <span className="sm:hidden">Rej.</span>
                ({rejectedActivities.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Floating Action Button for Mobile */}
          <Button 
            onClick={() => setShowAddDialog(true)}
            className={`${isMobile ? 'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40' : 'shrink-0'}`}
            size={isMobile ? "icon" : "default"}
          >
            <Plus className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4 mr-2'}`} />
            {!isMobile && "Submit New Activity"}
            {isMobile && <span className="sr-only">Submit New Activity</span>}
          </Button>
        </div>

        <TabsContent value="all">
          <div className="space-y-3 sm:space-y-4">
            {activities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No activities yet</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center mb-4 px-4">
                    Start by submitting your first achievement or activity for verification.
                  </p>
                  <Button onClick={() => setShowAddDialog(true)} size={isMobile ? "sm" : "default"}>
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
          <div className="space-y-3 sm:space-y-4">
            {pendingActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No pending activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center">
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
          <div className="space-y-3 sm:space-y-4">
            {approvedActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No approved activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center">
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
          <div className="space-y-3 sm:space-y-4">
            {rejectedActivities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No rejected activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center">
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

      {/* Add bottom padding for floating action button on mobile */}
      {isMobile && <div className="h-20" />}

      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddActivity}
      />
    </main>
  );
}