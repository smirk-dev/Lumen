import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PendingActivityCard } from "./PendingActivityCard";
import { ReviewActivityDialog } from "./ReviewActivityDialog";
import { Clock, CheckCircle, XCircle, Search, Filter, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import type { Activity } from "../../App";

interface FacultyReviewViewProps {
  activities: Activity[];
  onUpdateActivityStatus: (activityId: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export function FacultyReviewView({ activities, onUpdateActivityStatus }: FacultyReviewViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const activityTypes = [...new Set(activities.map(a => a.type))];

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || activity.status === filterStatus;
      const matchesType = filterType === "all" || activity.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case "oldest":
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        case "student":
          return a.studentName.localeCompare(b.studentName);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const stats = {
    total: activities.length,
    pending: activities.filter(a => a.status === 'pending').length,
    approved: activities.filter(a => a.status === 'approved').length,
    rejected: activities.filter(a => a.status === 'rejected').length,
  };

  const handleApprove = (activityId: string, comments?: string) => {
    onUpdateActivityStatus(activityId, 'approved', comments);
    setSelectedActivity(null);
  };

  const handleReject = (activityId: string, comments?: string) => {
    onUpdateActivityStatus(activityId, 'rejected', comments);
    setSelectedActivity(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("pending");
    setFilterType("all");
    setSortBy("newest");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Review</h1>
          <p className="text-muted-foreground">
            Review and approve student activity submissions
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {stats.pending} Pending
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All submissions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully reviewed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Needs revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
          <CardDescription>
            Find specific activities to review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities or students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="student">Student Name</SelectItem>
                <SelectItem value="title">Activity Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || filterStatus !== "pending" || filterType !== "all" || sortBy !== "newest") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary">Search: "{searchTerm}"</Badge>
                )}
                {filterStatus !== "pending" && (
                  <Badge variant="secondary">Status: {filterStatus}</Badge>
                )}
                {filterType !== "all" && (
                  <Badge variant="secondary">Type: {filterType}</Badge>
                )}
                {sortBy !== "newest" && (
                  <Badge variant="secondary">Sort: {sortBy}</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Queue - Pending Activities */}
      {stats.pending > 0 && filterStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              Priority Review Queue
            </CardTitle>
            <CardDescription>
              Activities requiring immediate attention (oldest submissions first)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities
                .filter(a => a.status === 'pending')
                .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
                .slice(0, 3)
                .map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {activity.studentName} • {format(new Date(activity.submittedAt), 'PPP')}
                      </p>
                      <Badge variant="outline" className="mt-1">{activity.type}</Badge>
                    </div>
                    <Button 
                      onClick={() => setSelectedActivity(activity)}
                      className="ml-4"
                    >
                      Review Now
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Activities ({filteredActivities.length})
          </h2>
          {filteredActivities.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
          )}
        </div>

        {filteredActivities.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {filteredActivities.map((activity) => (
              <PendingActivityCard
                key={activity.id}
                activity={activity}
                onReview={() => setSelectedActivity(activity)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              {activities.length === 0 ? (
                <div className="space-y-4">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <div>
                    <h3 className="text-lg font-medium">No Activities Submitted</h3>
                    <p className="text-muted-foreground">
                      No student activities have been submitted yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  <div>
                    <h3 className="text-lg font-medium">No Activities Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      {selectedActivity && (
        <ReviewActivityDialog
          activity={selectedActivity}
          open={!!selectedActivity}
          onOpenChange={(open) => !open && setSelectedActivity(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}