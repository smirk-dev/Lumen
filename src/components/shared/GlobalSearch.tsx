import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, FileText, Users, Award, Settings, TrendingUp, BookOpen, Filter, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../ui/utils';
import { useDebounce } from '../../hooks/useDebounce';
import type { User, Activity } from '../../App';

export interface GlobalSearchItem {
  id: string;
  title: string;
  description?: string;
  category: 'activity' | 'user' | 'page' | 'action';
  icon: React.ReactNode;
  url?: string;
  action?: () => void;
  metadata?: Record<string, any>;
  keywords?: string[];
}

export interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities?: Activity[];
  users?: User[];
  currentUserRole?: 'student' | 'faculty' | 'admin';
  onNavigate?: (path: string) => void;
  onAction?: (actionId: string, payload?: any) => void;
}

export function GlobalSearch({
  open,
  onOpenChange,
  activities = [],
  users = [],
  currentUserRole = 'student',
  onNavigate,
  onAction
}: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Generate searchable items based on available data and user role
  const searchableItems = useMemo((): GlobalSearchItem[] => {
    const items: GlobalSearchItem[] = [];

    // Navigation Pages
    const pageItems: GlobalSearchItem[] = [
      {
        id: 'nav-dashboard',
        title: 'Dashboard',
        description: 'View your main dashboard',
        category: 'page',
        icon: <TrendingUp className="h-4 w-4" />,
        url: '/dashboard',
        keywords: ['home', 'overview', 'main']
      },
      {
        id: 'nav-activities',
        title: 'Activities',
        description: currentUserRole === 'student' ? 'Manage your activities' : 'Review student activities',
        category: 'page',
        icon: <Award className="h-4 w-4" />,
        url: '/activities',
        keywords: ['submissions', 'achievements', 'portfolio']
      },
      {
        id: 'nav-analytics',
        title: 'Analytics',
        description: 'View detailed analytics and reports',
        category: 'page',
        icon: <TrendingUp className="h-4 w-4" />,
        url: '/analytics',
        keywords: ['charts', 'data', 'insights', 'reports']
      },
      {
        id: 'nav-settings',
        title: 'Settings',
        description: 'Manage your account settings',
        category: 'page',
        icon: <Settings className="h-4 w-4" />,
        url: '/settings',
        keywords: ['preferences', 'profile', 'account']
      }
    ];

    // Role-specific pages
    if (currentUserRole === 'admin') {
      pageItems.push(
        {
          id: 'nav-users',
          title: 'User Management',
          description: 'Manage users and permissions',
          category: 'page',
          icon: <Users className="h-4 w-4" />,
          url: '/admin/users',
          keywords: ['accounts', 'permissions', 'roles']
        },
        {
          id: 'nav-admin-analytics',
          title: 'Admin Analytics',
          description: 'View system-wide analytics',
          category: 'page',
          icon: <TrendingUp className="h-4 w-4" />,
          url: '/admin/analytics',
          keywords: ['system', 'metrics', 'overview']
        }
      );
    }

    if (currentUserRole === 'faculty') {
      pageItems.push({
        id: 'nav-review',
        title: 'Activity Review',
        description: 'Review and approve student activities',
        category: 'page',
        icon: <FileText className="h-4 w-4" />,
        url: '/faculty/review',
        keywords: ['approve', 'pending', 'submissions']
      });
    }

    items.push(...pageItems);

    // Quick Actions
    const actionItems: GlobalSearchItem[] = [
      {
        id: 'action-add-activity',
        title: 'Submit New Activity',
        description: 'Submit a new academic activity',
        category: 'action',
        icon: <Award className="h-4 w-4" />,
        action: () => onAction?.('add-activity'),
        keywords: ['create', 'new', 'submit', 'add']
      },
      {
        id: 'action-export-data',
        title: 'Export Data',
        description: 'Export your data to PDF or Excel',
        category: 'action',
        icon: <FileText className="h-4 w-4" />,
        action: () => onAction?.('export'),
        keywords: ['download', 'pdf', 'excel', 'backup']
      }
    ];

    if (currentUserRole === 'admin') {
      actionItems.push({
        id: 'action-add-user',
        title: 'Add New User',
        description: 'Create a new user account',
        category: 'action',
        icon: <Users className="h-4 w-4" />,
        action: () => onAction?.('add-user'),
        keywords: ['create', 'account', 'register']
      });
    }

    items.push(...actionItems);

    // Recent Activities
    const recentActivities = activities
      .slice(0, 10)
      .map((activity): GlobalSearchItem => ({
        id: `activity-${activity.id}`,
        title: activity.title,
        description: `${activity.type} • ${activity.status} • ${activity.studentName}`,
        category: 'activity',
        icon: <Award className="h-4 w-4" />,
        url: `/activities/${activity.id}`,
        metadata: activity,
        keywords: [activity.type, activity.status, activity.studentName]
      }));

    items.push(...recentActivities);

    // Users (for admin/faculty)
    if (currentUserRole === 'admin' || currentUserRole === 'faculty') {
      const userItems = users
        .slice(0, 20)
        .map((user): GlobalSearchItem => ({
          id: `user-${user.id}`,
          title: user.name,
          description: `${user.role} • ${user.email} ${user.department ? `• ${user.department}` : ''}`,
          category: 'user',
          icon: <Users className="h-4 w-4" />,
          url: `/users/${user.id}`,
          metadata: user,
          keywords: [user.role, user.email, user.department || '', user.studentId || '']
        }));

      items.push(...userItems);
    }

    return items;
  }, [activities, users, currentUserRole, onAction]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm) {
      // Show recent/popular items when no search term
      return searchableItems.slice(0, 8);
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return searchableItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description?.toLowerCase().includes(searchLower);
      const keywordMatch = item.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      );
      
      return titleMatch || descriptionMatch || keywordMatch;
    }).slice(0, 12);
  }, [searchableItems, debouncedSearchTerm]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, GlobalSearchItem[]> = {};
    
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleItemSelect(filteredItems[selectedIndex]);
          }
          break;
        case 'Escape':
          onOpenChange(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, selectedIndex, onOpenChange]);

  // Handle item selection
  const handleItemSelect = useCallback((item: GlobalSearchItem) => {
    if (item.action) {
      item.action();
    } else if (item.url && onNavigate) {
      onNavigate(item.url);
    }
    onOpenChange(false);
  }, [onNavigate, onOpenChange]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'page':
        return <BookOpen className="h-4 w-4" />;
      case 'activity':
        return <Award className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'action':
        return <Filter className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'page':
        return 'Pages';
      case 'activity':
        return 'Activities';
      case 'user':
        return 'Users';
      case 'action':
        return 'Actions';
      default:
        return 'Results';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="h-4 w-4 text-muted-foreground mr-3" />
          <Input
            placeholder="Search activities, users, pages, and actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>

        {/* Search Results */}
        <ScrollArea className="max-h-[60vh]">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {Object.entries(groupedItems).map(([category, items], groupIndex) => (
                <div key={category}>
                  {groupIndex > 0 && <Separator className="my-2" />}
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryLabel(category)}
                  </div>
                  {items.map((item) => {
                    const globalIndex = filteredItems.indexOf(item);
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-auto p-3 mb-1",
                          selectedIndex === globalIndex && "bg-muted"
                        )}
                        onClick={() => handleItemSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-shrink-0 text-muted-foreground">
                            {item.icon}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium truncate">{item.title}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">
                {searchTerm ? 'No results found' : 'Start typing to search'}
              </div>
              <div className="text-sm text-muted-foreground">
                {searchTerm 
                  ? 'Try different keywords or check your spelling'
                  : 'Search for activities, users, pages, and quick actions'
                }
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-3 bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ↵
                </kbd>
                <span>to select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ↑↓
                </kbd>
                <span>to navigate</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}