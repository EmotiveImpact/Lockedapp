import { useHabits, Habit } from "@/hooks/use-habits";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HabitsPage() {
  const { habits, addHabit, removeHabit } = useHabits();
  const [newHabit, setNewHabit] = useState({ title: '', xp: 50, category: 'routine' as const });
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    if (!newHabit.title) return;
    addHabit(newHabit);
    setNewHabit({ title: '', xp: 50, category: 'routine' });
    setIsOpen(false);
  };

  return (
    <div className="p-6 pt-12 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Protocols</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-0">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">New Protocol</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs uppercase text-muted-foreground font-bold">Title</label>
                <Input 
                  value={newHabit.title} 
                  onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  placeholder="e.g. Read 10 pages"
                  className="bg-black/20 border-white/10 focus:border-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-muted-foreground font-bold">XP Value</label>
                    <Input 
                    type="number"
                    value={newHabit.xp} 
                    onChange={(e) => setNewHabit({ ...newHabit, xp: Number(e.target.value) })}
                    className="bg-black/20 border-white/10 focus:border-primary/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-muted-foreground font-bold">Category</label>
                    <Select 
                        value={newHabit.category} 
                        onValueChange={(v: any) => setNewHabit({ ...newHabit, category: v })}
                    >
                        <SelectTrigger className="bg-black/20 border-white/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 text-foreground">
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="mindset">Mindset</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <Button onClick={handleAdd} className="w-full bg-primary text-black hover:bg-primary/90 mt-2">
                Create Protocol
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            className="flex items-center justify-between p-4 bg-card border border-white/5 rounded-xl group"
          >
            <div>
              <h3 className="font-medium text-foreground">{habit.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-primary px-1.5 py-0.5 bg-primary/10 rounded">+{habit.xp} XP</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{habit.category}</span>
              </div>
            </div>
            
            <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => removeHabit(habit.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
