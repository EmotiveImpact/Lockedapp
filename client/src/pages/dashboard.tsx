import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { XPProgress } from "@/components/xp-progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Dashboard() {
  const { habits, user, toggleHabit, completeDay, failDay, addHabit, removeHabit } = useHabits();
  const [activeTab, setActiveTab] = useState<'today' | 'habits' | 'xp'>('today');
  const [newHabit, setNewHabit] = useState({ title: '', xp: 50, category: 'routine' as const });
  const [isAddOpen, setIsAddOpen] = useState(false);

  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = user.todayCompletions.includes(a.id);
    const bCompleted = user.todayCompletions.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  const handleAddHabit = () => {
    if (!newHabit.title) return;
    addHabit(newHabit);
    setNewHabit({ title: '', xp: 50, category: 'routine' });
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      <XPProgress days={user.sprintDays} level={user.level} />

      <div className="flex-1 px-4 pb-8 space-y-6">
        
        {/* Centered Tabs */}
        <div className="flex justify-center border-b border-white/10 mb-6 w-full">
            <button 
                onClick={() => setActiveTab('today')}
                className={cn(
                    "px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 border-b-2",
                    activeTab === 'today' ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground opacity-50"
                )}
            >
                Today
            </button>
            <button 
                onClick={() => setActiveTab('habits')}
                className={cn(
                    "px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 border-b-2",
                    activeTab === 'habits' ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground opacity-50"
                )}
            >
                Habits
            </button>
            <button 
                onClick={() => setActiveTab('xp')}
                className={cn(
                    "px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 border-b-2",
                    activeTab === 'xp' ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground opacity-50"
                )}
            >
                XP
            </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'today' && (
            <div className="space-y-4">
                <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {sortedHabits.map((habit, index) => {
                    const isCompleted = user.todayCompletions.includes(habit.id);
                    
                    return (
                        <motion.div
                        key={habit.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => toggleHabit(habit.id)}
                        className={cn(
                            "group relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all duration-300",
                            isCompleted 
                                ? "bg-primary/5 border-primary/20" 
                                : "bg-card border-white/5 hover:border-white/10"
                        )}
                        >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                            <h3 className={cn(
                                "font-medium text-base transition-colors",
                                isCompleted ? "text-primary" : "text-foreground"
                            )}>
                                {habit.title}
                            </h3>
                            <p className="text-xs font-mono text-muted-foreground mt-1">+{habit.xp} XP</p>
                            </div>

                            <div className={cn(
                                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                isCompleted 
                                    ? "bg-primary border-primary" 
                                    : "border-white/20 group-hover:border-primary/50"
                            )}>
                                {isCompleted && <Check className="h-4 w-4 text-black" strokeWidth={3} />}
                            </div>
                        </div>
                        </motion.div>
                    );
                    })}
                </AnimatePresence>
                </div>

                <div className="pt-4 space-y-3">
                    <Button 
                        className="w-full bg-primary text-black hover:bg-primary/90 font-display text-lg uppercase tracking-wider h-14 rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                        onClick={completeDay}
                    >
                        Complete Day
                    </Button>
                    
                    <Button 
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium h-12 rounded-xl"
                        onClick={failDay}
                    >
                        I Failed
                    </Button>
                </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-display font-bold">PROTOCOLS</h2>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" className="rounded-full h-10 w-10 bg-white/10 text-white border-0">
                                <Plus size={20} />
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
                                    placeholder="e.g. Morning Run"
                                    className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-muted-foreground font-bold">XP</label>
                                        <Input 
                                            type="number" 
                                            value={newHabit.xp} 
                                            onChange={(e) => setNewHabit({...newHabit, xp: Number(e.target.value)})} 
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-muted-foreground font-bold">Category</label>
                                        <Select 
                                            value={newHabit.category} 
                                            onValueChange={(v: any) => setNewHabit({ ...newHabit, category: v })}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-card border-white/10 text-foreground">
                                                <SelectItem value="routine">Routine</SelectItem>
                                                <SelectItem value="fitness">Fitness</SelectItem>
                                                <SelectItem value="health">Health</SelectItem>
                                                <SelectItem value="mindset">Mindset</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button onClick={handleAddHabit} className="w-full bg-primary text-black">Create Protocol</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-3">
                    {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group">
                            <div>
                                <h3 className="font-medium">{habit.title}</h3>
                                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">{habit.category} · {habit.xp} XP</p>
                            </div>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeHabit(habit.id)}
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'xp' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                    <p className="text-muted-foreground uppercase text-xs font-bold tracking-[0.2em] mb-4">Total Progression</p>
                    <div className="text-6xl font-display font-black text-primary mb-2 tracking-tighter">{user.currentXp}</div>
                    <p className="text-white/60 text-sm font-medium">Earn {user.nextLevelXp - user.currentXp} XP more to reach LVL {user.level + 1}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Today's Gain</p>
                        <div className="text-2xl font-display font-bold text-primary">+{user.todayCompletions.length * 45}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Average Daily</p>
                        <div className="text-2xl font-display font-bold text-white">320</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Recent Breakthroughs</h3>
                    {[
                        { title: 'Consistency King', date: 'Yesterday', xp: '+250' },
                        { title: 'Sprint Starter', date: '2 days ago', xp: '+100' },
                        { title: 'Perfect Day', date: '3 days ago', xp: '+500' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <div className="font-bold text-sm">{item.title}</div>
                                <div className="text-[10px] text-muted-foreground uppercase">{item.date}</div>
                            </div>
                            <div className="text-primary font-display font-bold">{item.xp}</div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
