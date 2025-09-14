import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { ReviewActivityDialog } from "./ReviewActivityDialog";
import { FacultyStats } from "./FacultyStats";
import { PendingActivityCard } from "./PendingActivityCard";
import { Search, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import type { User, Activity } from "../../App";

interface FacultyDashboardProps {
  user: User;
  activities: Activity[];
  onUpdateActivityStatus: (activityId: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export function FacultyDashboard({ user, activities, onUpdateActivityStatus }: FacultyDashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Faculty Review Dashboard</h1>
        <p className="text-muted-foreground">
          Review and verify student activity submissions.
        </p>
      </div>

      {/* Quick Stats */}
      <FacultyStats activities={activities} />

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by student name, activity title, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending Review ({filterActivities(pendingActivities).length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved ({filterActivities(approvedActivities).length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="h-4 w-4 mr-2" />
            Rejected ({filterActivities(rejectedActivities).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            All Activities ({filterActivities(activities).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {filterActivities(pendingActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending activities</h3>
                  <p className="text-muted-foreground text-center">
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
          <div className="space-y-4">
            {filterActivities(approvedActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved activities</h3>
                  <p className="text-muted-foreground text-center">
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
          <div className="space-y-4">
            {filterActivities(rejectedActivities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rejected activities</h3>
                  <p className="text-muted-foreground text-center">
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
          <div className="space-y-4">
            {filterActivities(activities).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-muted-foreground text-center">
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
          onOpenChange={() => setSelectedActivity(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </main>
  );
}