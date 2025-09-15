import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trophy, Trash2, CheckCircle } from "lucide-react";
import { AddAchievementDialog } from "./AddAchievementDialog";
import { toast } from "sonner";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  verified: boolean;
}

interface AchievementGalleryProps {
  achievements: Achievement[];
  onAddAchievement: (achievement: Achievement) => void;
  onDeleteAchievement: (id: number) => void;
  onVerifyAchievement: (id: number) => void;
}

export function AchievementGallery({ 
  achievements, 
  onAddAchievement, 
  onDeleteAchievement, 
  onVerifyAchievement 
}: AchievementGalleryProps) {
  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteAchievement(id);
      toast.success("Achievement deleted successfully");
    }
  };

  const handleVerify = (id: number, title: string) => {
    onVerifyAchievement(id);
    toast.success(`"${title}" has been verified!`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievements ({achievements.length})</CardTitle>
        <AddAchievementDialog onAddAchievement={onAddAchievement} />
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No achievements yet. Add your first achievement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {achievement.verified ? (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleVerify(achievement.id, achievement.title)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => handleDelete(achievement.id, achievement.title)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {achievement.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {achievement.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}