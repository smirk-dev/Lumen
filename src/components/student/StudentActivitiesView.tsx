import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AddActivityDialog } from "./AddActivityDialog";
import { ActivityCard } from "./ActivityCard";
import { SearchWithSuggestions } from "../shared/SearchWithSuggestions";
import { FilterChips } from "../shared/FilterChips";
import { Plus, Search, Filter, Calendar, Award, Clock, XCircle } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";
import { useFilters, type FilterConfig } from "../../hooks/useFilters";

import { useIsMobile } from "../ui/use-mobile";
import type { User, Activity } from "../../App";

interface StudentActivitiesViewProps {
  user: User;
  activities: Activity[];
  onAddActivity: (activityData: Omit<Activity, 'id' | 'submittedAt' | 'status'>) => void;
}

export function StudentActivitiesView({ user, activities, onAddActivity }: StudentActivitiesViewProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const isMobile = useIsMobile();

  // Filter configuration for the enhanced filtering system
  const filterConfigs: FilterConfig[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'all',
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
    searchFields: ['title', 'description', 'type'],
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
      case "title":
        return a.title.localeCompare(b.title);
      case "type":
        return a.type.localeCompare(b.type);
      case "status":
        const statusOrder = { 'pending': 0, 'approved': 1, 'rejected': 2 };
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      default:
        return 0;
    }
  });

  const stats = {
    total: activities.length,
    approved: activities.filter(a => a.status === 'approved').length,
    pending: activities.filter(a => a.status === 'pending').length,
    rejected: activities.filter(a => a.status === 'rejected').length,
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    clearAllFilters();
    setSortBy("newest");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Activities</h1>
          <p className="text-muted-foreground">
            Track and manage your academic activities
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className={`${isMobile ? 'w-full sm:w-auto' : ''}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit New Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully reviewed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Need revision</p>
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
            Find specific activities using advanced search and filtering
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
                placeholder="Search your activities, titles, or descriptions..."
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
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="type">Type A-Z</SelectItem>
                <SelectItem value="status">Status (Pending First)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-2">
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
              <ActivityCard
                key={activity.id}
                activity={activity}
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
                    <h3 className="text-lg font-medium">No Activities Yet</h3>
                    <p className="text-muted-foreground">
                      Get started by submitting your first academic activity
                    </p>
                  </div>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Activity
                  </Button>
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

      {/* Add Activity Dialog */}
      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(activityData) => {
          onAddActivity({
            ...activityData,
            studentId: user.studentId!,
            studentName: user.name,
          });
          setShowAddDialog(false);
        }}
      />

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Activity</span>
        </Button>
      )}
    </div>
  );
}