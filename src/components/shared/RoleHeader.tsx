import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { LogOut, GraduationCap, User, Users, Shield, Menu, Home, BarChart3, FileText, Settings } from "lucide-react";
import { useIsMobile } from "../ui/use-mobile";
import type { User as UserType, NavigationSection } from "../../App";

interface RoleHeaderProps {
  user: UserType;
  onLogout: () => void;
  currentSection: NavigationSection;
  onNavigate: (section: NavigationSection) => void;
}

export function RoleHeader({ user, onLogout, currentSection, onNavigate }: RoleHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'faculty':
        return <Users className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'faculty':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", section: "dashboard" as NavigationSection },
      { icon: BarChart3, label: "Analytics", section: "analytics" as NavigationSection },
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { icon: FileText, label: "My Activities", section: "activities" as NavigationSection },
          { icon: User, label: "Profile", section: "profile" as NavigationSection },
        ];
      case 'faculty':
        return [
          ...baseItems,
          { icon: FileText, label: "Review Activities", section: "review" as NavigationSection },
          { icon: Users, label: "Students", section: "students" as NavigationSection },
        ];
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: "User Management", section: "user-management" as NavigationSection },
          { icon: FileText, label: "Reports", section: "reports" as NavigationSection },
          { icon: Settings, label: "Settings", section: "settings" as NavigationSection },
        ];
      default:
        return baseItems;
    }
  };

  const MobileNavigation = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Smart Student Hub
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar>
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <Badge variant="secondary" className={`mt-1 ${getRoleColor(user.role)} text-xs`}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role}</span>
              </Badge>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {getNavigationItems().map((item, index) => (
              <Button
                key={index}
                variant={currentSection === item.section ? "default" : "ghost"}
                className="w-full justify-start h-12 text-left"
                onClick={() => {
                  onNavigate(item.section);
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {isMobile && <MobileNavigation />}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Smart Student Hub</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {user.role === 'student' && 'Student Portal'}
                  {user.role === 'faculty' && 'Faculty Dashboard'}
                  {user.role === 'admin' && 'Administrative Console'}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              {getNavigationItems().map((item, index) => (
                <Button 
                  key={index} 
                  variant={currentSection === item.section ? "default" : "ghost"} 
                  className="flex items-center gap-2"
                  onClick={() => onNavigate(item.section)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          )}

          {/* User Info and Actions - Desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              
              <Badge variant="secondary" className={getRoleColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role}</span>
              </Badge>

              <Avatar>
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile User Avatar and Logout */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}