import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut, GraduationCap, User, Users, Shield } from "lucide-react";
import type { User as UserType } from "../../App";

interface RoleHeaderProps {
  user: UserType;
  onLogout: () => void;
}

export function RoleHeader({ user, onLogout }: RoleHeaderProps) {
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

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Smart Student Hub</h1>
              <p className="text-sm text-muted-foreground">
                {user.role === 'student' && 'Student Portal'}
                {user.role === 'faculty' && 'Faculty Dashboard'}
                {user.role === 'admin' && 'Administrative Console'}
              </p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  );
}