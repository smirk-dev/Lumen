import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { ReviewActivityDialog } from "./ReviewActivityDialog";
import { FacultyStats } from "./FacultyStats";
import { PendingActivityCard } from "./PendingActivityCard";
import { Search, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import type { Activity } from "../../App";

interface FacultyDashboardProps {
  activities: Activity[];
  onUpdateActivityStatus: (activityId: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export function FacultyDashboard({ activities, onUpdateActivityStatus }: FacultyDashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const pendingActivities = activities.filter(a => a.status === 'pending');
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const rejectedActivities = activities.filter(a => a.status === 'rejected');

  // Filter activities based on search term
  const filterActivities = (activityList: Activity[]) => {
    if (!searchTerm) return activityList;
    return activityList.filter(activity =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleReview = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleApprove = (activityId: string, comments: string) => {
    onUpdateActivityStatus(activityId, 'approved', comments);
    setSelectedActivity(null);
  };

  const handleReject = (activityId: string, comments: string) => {
    onUpdateActivityStatus(activityId, 'rejected', comments);
    setSelectedActivity(null);
  };

  return (
    <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Faculty Review Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review and verify student activity submissions.
        </p>
      </div>

      {/* Quick Stats */}
      <FacultyStats activities={activities} />

      {/* Search Bar - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Search Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={isMobile ? "Search activities..." : "Search by student name, activity title, or type..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md"
          />
        </CardContent>
      </Card>

      {/* Main Content Tabs - Mobile Optimized */}
      <Tabs defaultValue="pending" className="space-y-4 sm:space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 min-w-max sm:min-w-0">
            <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Pend.</span>
              ({filterActivities(pendingActivities).length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Approved</span>
              <span className="sm:hidden">Appr.</span>
              ({filterActivities(approvedActivities).length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Rejected</span>
              <span className="sm:hidden">Rej.</span>
              ({filterActivities(rejectedActivities).length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3 py-2 col-span-2 sm:col-span-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              All ({filterActivities(activities).length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending">
          <div className="space-y-3 sm:space-y-4">
            {filterActivities(pendingActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No pending activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
                    {searchTerm ? "No activities match your search criteria." : "All submissions have been reviewed."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterActivities(pendingActivities).map(activity => (
                <PendingActivityCard
                  key={activity.id}
                  activity={activity}
                  onReview={() => handleReview(activity)}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-3 sm:space-y-4">
            {filterActivities(approvedActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No approved activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
                    {searchTerm ? "No approved activities match your search criteria." : "Approved activities will appear here."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterActivities(approvedActivities).map(activity => (
                <PendingActivityCard
                  key={activity.id}
                  activity={activity}
                  onReview={() => handleReview(activity)}
                  hideActions
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-3 sm:space-y-4">
            {filterActivities(rejectedActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No rejected activities</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
                    {searchTerm ? "No rejected activities match your search criteria." : "Rejected activities will appear here."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterActivities(rejectedActivities).map(activity => (
                <PendingActivityCard
                  key={activity.id}
                  activity={activity}
                  onReview={() => handleReview(activity)}
                  hideActions
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-3 sm:space-y-4">
            {filterActivities(activities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
                    {searchTerm ? "No activities match your search criteria." : "No student submissions yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterActivities(activities).map(activity => (
                <PendingActivityCard
                  key={activity.id}
                  activity={activity}
                  onReview={() => handleReview(activity)}
                  hideActions={activity.status !== 'pending'}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedActivity && (
        <ReviewActivityDialog
          activity={selectedActivity}
          open={!!selectedActivity}
          onOpenChange={(open) => !open && setSelectedActivity(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </main>
  );
}