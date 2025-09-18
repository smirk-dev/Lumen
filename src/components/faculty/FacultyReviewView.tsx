import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PendingActivityCard } from "./PendingActivityCard";
import { ReviewActivityDialog } from "./ReviewActivityDialog";
import { SearchWithSuggestions } from "../shared/SearchWithSuggestions";
import { FilterChips } from "../shared/FilterChips";
import { Clock, CheckCircle, XCircle, Search, Filter, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import { useSearch } from "../../hooks/useSearch";
import { useFilters, type FilterConfig } from "../../hooks/useFilters";
import type { Activity } from "../../App";

interface FacultyReviewViewProps {
  activities: Activity[];
  onUpdateActivityStatus: (activityId: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export function FacultyReviewView({ activities, onUpdateActivityStatus }: FacultyReviewViewProps) {
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Filter configuration for the enhanced filtering system
  const filterConfigs: FilterConfig[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    {
      id: 'type',
      label: 'Activity Type',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Types' },
        ...Array.from(new Set(activities.map(a => a.type))).map(type => ({
          value: type,
          label: type
        }))
      ]
    },
    {
      id: 'studentName',
      label: 'Student',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Students' },
        ...Array.from(new Set(activities.map(a => a.studentName))).sort().map(name => ({
          value: name,
          label: name
        }))
      ]
    }
  ];

  // Enhanced search hook
  const {
    searchTerm,
    setSearchTerm,
    filteredItems: searchFilteredActivities,
    searchSuggestions,
    searchHistory,
    clearHistory
  } = useSearch(activities, {
    searchFields: ['title', 'studentName', 'description', 'type'],
    debounceMs: 200
  });

  // Enhanced filters hook
  const {
    filteredItems: finalFilteredActivities,
    activeFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    saveCurrentFilters,
    loadSavedFilter,
    deleteSavedFilter,
    savedFilters,
    filters
  } = useFilters(searchFilteredActivities, filterConfigs);

  // Apply sorting to the final filtered results
  const sortedActivities = finalFilteredActivities.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case "student":
        return a.studentName.localeCompare(b.studentName);
      case "title":
        return a.title.localeCompare(b.title);
      case "priority":
        // Priority: pending first, then by submission date (oldest pending first)
        if (a.status !== b.status) {
          if (a.status === 'pending') return -1;
          if (b.status === 'pending') return 1;
        }
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
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

  const handleClearAllFilters = () => {
    setSearchTerm('');
    clearAllFilters();
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

      {/* Enhanced Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Enhanced Search & Filter
          </CardTitle>
          <CardDescription>
            Find specific activities with advanced search and filtering options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Search */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <SearchWithSuggestions
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={setSearchTerm}
                placeholder="Search activities, students, or descriptions..."
                suggestions={searchSuggestions}
                searchHistory={searchHistory}
                onClearHistory={clearHistory}
                maxSuggestions={6}
                maxHistory={4}
              />
            </div>
            
            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority (Pending First)</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="student">Student Name</SelectItem>
                <SelectItem value="title">Activity Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending ({activities.filter(a => a.status === 'pending').length})</SelectItem>
                <SelectItem value="approved">Approved ({activities.filter(a => a.status === 'approved').length})</SelectItem>
                <SelectItem value="rejected">Rejected ({activities.filter(a => a.status === 'rejected').length})</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Array.from(new Set(activities.map(a => a.type))).map(type => (
                  <SelectItem key={type} value={type}>
                    {type} ({activities.filter(a => a.type === type).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.studentName} onValueChange={(value) => updateFilter('studentName', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {Array.from(new Set(activities.map(a => a.studentName))).sort().map(name => (
                  <SelectItem key={name} value={name}>
                    {name} ({activities.filter(a => a.studentName === name).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Chips */}
          <FilterChips
            activeFilters={activeFilters}
            savedFilters={savedFilters}
            onClearFilter={clearFilter}
            onClearAllFilters={handleClearAllFilters}
            onSaveFilters={saveCurrentFilters}
            onLoadSavedFilter={loadSavedFilter}
            onDeleteSavedFilter={deleteSavedFilter}
            showSaveFilters={true}
          />
        </CardContent>
      </Card>

      {/* Priority Queue - Pending Activities */}
      {stats.pending > 0 && filters.status === "pending" && (
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
            Activities ({sortedActivities.length})
          </h2>
          {sortedActivities.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {sortedActivities.length} of {activities.length} activities
            </div>
          )}
        </div>

        {sortedActivities.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {sortedActivities.map((activity) => (
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
                  <Button variant="outline" onClick={handleClearAllFilters}>
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