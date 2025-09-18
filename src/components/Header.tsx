import { useState, useEffect } from "react";
import { Bell, Search, Settings, BookOpen, Trophy, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GlobalSearch } from "./shared/GlobalSearch";
import type { User, Activity } from "../App";

interface HeaderProps {
  currentUser?: User;
  activities?: Activity[];
  allUsers?: User[];
  onNavigate?: (path: string) => void;
  onAction?: (actionId: string, payload?: any) => void;
}

export function Header({ 
  currentUser, 
  activities = [], 
  allUsers = [], 
  onNavigate,
  onAction 
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };
  return (
    <header className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold">Smart Student Hub</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Records
          </Button>
        </nav>

        <div className="flex items-center gap-4">
          {/* Enhanced Search */}
          <Button
            variant="outline"
            className="relative hidden sm:flex items-center gap-2 w-64 justify-start text-muted-foreground"
            onClick={handleSearchClick}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search everything...</span>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                ⌘K
              </kbd>
            </div>
          </Button>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={handleSearchClick}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
            <AvatarFallback>
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('') : 'JS'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearch
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        activities={activities}
        users={allUsers}
        currentUserRole={currentUser?.role || 'student'}
        onNavigate={onNavigate}
        onAction={onAction}
      />
    </header>
  );
}