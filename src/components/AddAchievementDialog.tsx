import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trophy, Award, Star, Medal, FileText, Crown } from "lucide-react";
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

interface AddAchievementDialogProps {
  onAddAchievement: (achievement: Achievement) => void;
}

export function AddAchievementDialog({ onAddAchievement }: AddAchievementDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    { value: "Academic Excellence", icon: Crown, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { value: "Research", icon: Award, color: "text-blue-600", bgColor: "bg-blue-100" },
    { value: "Collaboration", icon: Trophy, color: "text-green-600", bgColor: "bg-green-100" },
    { value: "Competition", icon: Medal, color: "text-purple-600", bgColor: "bg-purple-100" },
    { value: "Leadership", icon: FileText, color: "text-orange-600", bgColor: "bg-orange-100" },
    { value: "Dedication", icon: Star, color: "text-red-600", bgColor: "bg-red-100" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedCategory = categories.find(cat => cat.value === formData.category);
    const newAchievement: Achievement = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      date: new Date(formData.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      }),
      category: formData.category,
      icon: selectedCategory?.icon || Trophy,
      color: selectedCategory?.color || "text-blue-600",
      bgColor: selectedCategory?.bgColor || "bg-blue-100",
      verified: false,
    };

    onAddAchievement(newAchievement);
    toast.success("Achievement added successfully!");
    
    setFormData({
      title: "",
      description: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Achievement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Achievement Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Dean's List, Research Award..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your achievement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className={`h-4 w-4 ${category.color}`} />
                      {category.value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date Achieved</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Achievement</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}