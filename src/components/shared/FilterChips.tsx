import React from 'react';
import { X, Filter, Bookmark, Trash2, Save } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';
import type { ActiveFilter, SavedFilter } from '../../hooks/useFilters';

export interface FilterChipsProps {
  activeFilters: ActiveFilter[];
  savedFilters?: SavedFilter[];
  onClearFilter: (filterId: string) => void;
  onClearAllFilters: () => void;
  onSaveFilters?: (name: string) => void;
  onLoadSavedFilter?: (filterId: string) => void;
  onDeleteSavedFilter?: (filterId: string) => void;
  className?: string;
  showSaveFilters?: boolean;
  maxChipsBeforeCollapse?: number;
}

export function FilterChips({
  activeFilters,
  savedFilters = [],
  onClearFilter,
  onClearAllFilters,
  onSaveFilters,
  onLoadSavedFilter,
  onDeleteSavedFilter,
  className,
  showSaveFilters = true,
  maxChipsBeforeCollapse = 5
}: FilterChipsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [filterName, setFilterName] = React.useState('');
  const [showAllFilters, setShowAllFilters] = React.useState(false);

  const visibleFilters = showAllFilters 
    ? activeFilters 
    : activeFilters.slice(0, maxChipsBeforeCollapse);
  const hiddenCount = activeFilters.length - maxChipsBeforeCollapse;

  const handleSaveFilter = () => {
    if (filterName.trim() && onSaveFilters) {
      onSaveFilters(filterName.trim());
      setFilterName('');
      setSaveDialogOpen(false);
    }
  };

  if (activeFilters.length === 0 && savedFilters.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-3 w-3" />
            <span>Active filters:</span>
          </div>
          
          {visibleFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 hover:bg-muted/80 transition-colors"
            >
              <span className="text-xs font-medium">{filter.label}:</span>
              <span className="text-xs">{filter.displayValue}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(filter.id)}
                className="h-auto w-auto p-0 ml-1 hover:bg-destructive/20 hover:text-destructive"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter.label} filter</span>
              </Button>
            </Badge>
          ))}

          {/* Show more filters button */}
          {!showAllFilters && hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllFilters(true)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              +{hiddenCount} more
            </Button>
          )}

          {/* Show less filters button */}
          {showAllFilters && hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllFilters(false)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Show less
            </Button>
          )}

          <Separator orientation="vertical" className="h-4" />

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {showSaveFilters && onSaveFilters && activeFilters.length > 0 && (
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Save Filter Set</DialogTitle>
                    <DialogDescription>
                      Give your filter combination a name to save it for later use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="filter-name">Filter Name</Label>
                    <Input
                      id="filter-name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="Enter filter name..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveFilter();
                        }
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
                      Save Filter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllFilters}
              className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Bookmark className="h-3 w-3" />
            <span>Saved filters:</span>
          </div>
          
          {savedFilters.slice(0, 3).map((savedFilter) => (
            <div key={savedFilter.id} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLoadSavedFilter?.(savedFilter.id)}
                className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary"
              >
                <Bookmark className="h-3 w-3 mr-1" />
                {savedFilter.name}
              </Button>
              {onDeleteSavedFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteSavedFilter(savedFilter.id)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="h-2 w-2" />
                  <span className="sr-only">Delete {savedFilter.name}</span>
                </Button>
              )}
            </div>
          ))}

          {savedFilters.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  +{savedFilters.length - 3} more
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">All Saved Filters</h4>
                  <div className="space-y-1">
                    {savedFilters.map((savedFilter) => (
                      <div
                        key={savedFilter.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onLoadSavedFilter?.(savedFilter.id)}
                            className="h-auto p-0 text-sm font-normal justify-start w-full"
                          >
                            <Bookmark className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{savedFilter.name}</span>
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            Saved {savedFilter.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        {onDeleteSavedFilter && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteSavedFilter(savedFilter.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete {savedFilter.name}</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* Filter Summary */}
      {activeFilters.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
        </div>
      )}
    </div>
  );
}