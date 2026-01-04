import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { XPProgress } from "@/components/xp-progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2, X } from "lucide-react";
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
  const { habits, user, toggleHabit, completeDay, failDay, addHabit, removeHabit, setQuickActionOpen } = useHabits();
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
    <div className="flex flex-col min-h-full pb-32">
      {/* Protocol Header - The "Look" */}
      <div className="p-8 pb-0 bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between absolute top-8 px-8 left-0">
            <div className="w-10" /> {/* Spacer */}
            <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none absolute left-1/2 -translate-x-1/2 uppercase">LOCKED IN</h1>
            <button 
              onClick={() => setQuickActionOpen(false)}
              className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mt-20 mb-4 flex flex-col items-center w-full px-4">
            <XPProgress days={user.sprintDays} level={user.level} />
          </div>

          {/* Simplified Tabs Centered */}
          <div className="flex justify-center w-full border-t border-white/5">
              <button 
                  onClick={() => setActiveTab('today')}
                  className={cn(
                      "px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 border-b-2",
                      activeTab === 'today' ? "border-primary text-primary font-black" : "border-transparent text-muted-foreground opacity-30"
                  )}
              >
                  Today
              </button>
              <button 
                  onClick={() => setActiveTab('habits')}
                  className={cn(
                      "px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 border-b-2",
                      activeTab === 'habits' ? "border-primary text-primary font-black" : "border-transparent text-muted-foreground opacity-30"
                  )}
              >
                  Habits
              </button>
              <button 
                  onClick={() => setActiveTab('xp')}
                  className={cn(
                      "px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 border-b-2",
                      activeTab === 'xp' ? "border-primary text-primary font-black" : "border-transparent text-muted-foreground opacity-30"
                  )}
              >
                  XP
              </button>
          </div>
      </div>

      <div className="flex-1 px-6 space-y-8 mt-6">
        <div className="min-h-[400px]">
          {activeTab === 'today' && (
            <div className="space-y-6">
                <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {sortedHabits.map((habit, index) => {
                    const isCompleted = user.todayCompletions.includes(habit.id);
                    
                    return (
                        <motion.div
                        key={habit.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => toggleHabit(habit.id)}
                        className={cn(
                            "group relative overflow-hidden rounded-[20px] bg-card border p-6 cursor-pointer transition-all duration-300",
                            isCompleted 
                                ? "border-primary/40 shadow-[0_0_20px_rgba(204,255,0,0.05)]" 
                                : "border-white/5 hover:border-white/10"
                        )}
                        >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h3 className={cn(
                                    "font-bold text-lg transition-colors",
                                    isCompleted ? "text-primary" : "text-foreground"
                                )}>
                                    {habit.title}
                                </h3>
                                <p className="text-[10px] font-black text-primary/60 mt-1 uppercase tracking-[0.2em]">+{habit.xp} XP</p>
                            </div>

                            <div className={cn(
                                "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                isCompleted 
                                    ? "bg-primary border-primary shadow-[0_0_15px_rgba(204,255,0,0.5)]" 
                                    : "border-white/10 group-hover:border-primary/50"
                            )}>
                                {isCompleted && <Check className="h-4 w-4 text-black" strokeWidth={4} />}
                            </div>
                        </div>
                        </motion.div>
                    );
                    })}
                </AnimatePresence>
                </div>

                <div className="pt-8 space-y-4">
                    <Button 
                        className="w-full bg-primary text-black hover:bg-primary/90 font-display text-2xl uppercase font-black tracking-widest h-20 rounded-[20px] shadow-[0_10px_40px_rgba(204,255,0,0.2)]"
                        onClick={completeDay}
                    >
                        Complete Day
                    </Button>
                    
                    <Button 
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-white hover:bg-white/5 font-black h-14 rounded-2xl uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100 transition-all"
                        onClick={failDay}
                    >
                        I Failed
                    </Button>
                </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="space-y-8 animate-in fade-in">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-display font-black tracking-widest italic">PROTOCOLS</h2>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" className="rounded-full h-12 w-12 bg-white/5 text-primary border border-white/10">
                                <Plus size={24} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-white/10 text-foreground rounded-[32px]">
                            <DialogHeader>
                                <DialogTitle className="font-display tracking-widest uppercase italic">New Protocol</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Title</label>
                                    <Input 
                                    value={newHabit.title} 
                                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                                    className="bg-black/40 border-white/10 h-14 rounded-xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">XP Value</label>
                                        <Input 
                                            type="number" 
                                            value={newHabit.xp} 
                                            onChange={(e) => setNewHabit({...newHabit, xp: Number(e.target.value)})} 
                                            className="bg-black/40 border-white/10 h-14 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Category</label>
                                        <Select 
                                            value={newHabit.category} 
                                            onValueChange={(v: any) => setNewHabit({ ...newHabit, category: v })}
                                        >
                                            <SelectTrigger className="bg-black/40 border-white/10 h-14 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-card border-white/10 text-foreground">
                                                <SelectItem value="routine">Routine</SelectItem>
                                                <SelectItem value="fitness">Fitness</SelectItem>
                                                <SelectItem value="health">Health</SelectItem>
                                                <SelectItem value="mindset">Mindset</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button onClick={handleAddHabit} className="w-full bg-primary text-black font-black uppercase h-16 rounded-xl mt-4">Create Protocol</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl group">
                            <div>
                                <h3 className="font-bold text-lg">{habit.title}</h3>
                                <p className="text-[10px] text-primary uppercase font-black tracking-[0.3em] mt-1">{habit.category} · {habit.xp} XP</p>
                            </div>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeHabit(habit.id)}
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'xp' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 px-2">
                <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full translate-y-1/2" />
                    <p className="text-muted-foreground uppercase text-[10px] font-black tracking-[0.4em] mb-4 opacity-40 relative z-10">Total Progression</p>
                    <div className="text-8xl font-display font-black text-primary mb-2 tracking-tighter drop-shadow-[0_0_25px_rgba(204,255,0,0.4)] relative z-10">{user.currentXp}</div>
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest relative z-10">LVL {user.level} · {user.nextLevelXp - user.currentXp} XP TO UPGRADE</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 opacity-40">Today</p>
                        <div className="text-4xl font-display font-black text-primary">+{user.todayCompletions.length * 45}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 opacity-40">Streak</p>
                        <div className="text-4xl font-display font-black text-white">{user.streak}D</div>
                    </div>
                </div>

                <div className="space-y-6 pt-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary px-2">Recent Log</h3>
                    {[
                        { title: 'Consistency King', date: 'Yesterday', xp: '+250' },
                        { title: 'Sprint Starter', date: '2 days ago', xp: '+100' },
                        { title: 'Perfect Day', date: '3 days ago', xp: '+500' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-7 bg-white/5 rounded-3xl border border-white/5 shadow-sm">
                            <div>
                                <div className="font-black text-sm uppercase tracking-widest">{item.title}</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-50">{item.date}</div>
                            </div>
                            <div className="text-primary font-display font-bold text-xl tracking-tighter">{item.xp}</div>
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
