import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { XPProgress } from "@/components/xp-progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2, X, Zap, Brain, Flame, Heart, Sparkles, CheckCircle2 } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBulkHabits } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { habits, user, toggleHabit, completeDay, failDay, addHabit, removeHabit } = useHabits();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'today' | 'habits' | 'xp' | 'library'>('today');
  const [newHabit, setNewHabit] = useState({ title: '', xp: 50, category: 'routine' as const });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [installedBundles, setInstalledBundles] = useState<Set<string>>(new Set());


  // UI feedback (haptics + micro-vibration animation) when selecting tasks
  const [jiggleHabitId, setJiggleHabitId] = useState<number | null>(null);
  const [flashHabitId, setFlashHabitId] = useState<number | null>(null);

  // Protocol bundles
  const PROTOCOL_BUNDLES = [
    {
      id: "monk-mode",
      name: "Monk Mode",
      description: "Digital detox + deep work",
      difficulty: "intermediate" as const,
      icon: Brain,
      color: "purple",
      habits: [
        { title: "No social media", xp: 60, category: "mindset" },
        { title: "2hr deep work block", xp: 80, category: "mindset" },
        { title: "Meditation 20min", xp: 50, category: "mindset" },
        { title: "Read 30 pages", xp: 40, category: "routine" },
      ],
    },
    {
      id: "75-hard",
      name: "75 Hard",
      description: "Ultimate mental toughness",
      difficulty: "extreme" as const,
      icon: Flame,
      color: "red",
      habits: [
        { title: "2 workouts (1 outdoor)", xp: 100, category: "fitness" },
        { title: "Follow diet strictly", xp: 60, category: "health" },
        { title: "Drink 1 gallon water", xp: 40, category: "health" },
        { title: "Read 10 pages", xp: 30, category: "routine" },
      ],
    },
    {
      id: "morning-routine",
      name: "5AM Club",
      description: "Own your morning",
      difficulty: "beginner" as const,
      icon: Sparkles,
      color: "yellow",
      habits: [
        { title: "Wake up at 5 AM", xp: 50, category: "routine" },
        { title: "Cold shower", xp: 40, category: "health" },
        { title: "Journal 10min", xp: 30, category: "mindset" },
        { title: "Workout 20min", xp: 50, category: "fitness" },
      ],
    },
  ];

  const installMutation = useMutation({
    mutationFn: createBulkHabits,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "PROTOCOL INSTALLED",
        description: `Added ${variables.length} habits to your system.`,
        className: "bg-primary text-primary-foreground border-none font-display uppercase tracking-wider"
      });
    },
  });

  const handleInstall = (bundle: typeof PROTOCOL_BUNDLES[0]) => {
    installMutation.mutate(bundle.habits);
    setInstalledBundles(prev => new Set(prev).add(bundle.id));
  };

  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = user.todayCompletions.includes(a.id);
    const bCompleted = user.todayCompletions.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  const triggerHaptic = () => {
    try {
      // Mobile haptics (supported on many devices)
      if ("vibrate" in navigator) {
        // short, snappy vibration
        // @ts-ignore
        navigator.vibrate(18);
      }
    } catch {
      // ignore
    }
  };

  const handleHabitPress = (habitId: number) => {
    triggerHaptic();

    setJiggleHabitId(habitId);
    setFlashHabitId(habitId);

    // Clear effects after animation
    window.setTimeout(() => setJiggleHabitId((prev) => (prev === habitId ? null : prev)), 260);
    window.setTimeout(() => setFlashHabitId((prev) => (prev === habitId ? null : prev)), 520);

    toggleHabit(habitId);
  };

  const handleAddHabit = () => {
    if (!newHabit.title) return;
    addHabit(newHabit);
    setNewHabit({ title: '', xp: 50, category: 'routine' });
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full pb-32">
      {/* Protocol Header */}
      <div className="p-8 pb-0 bg-gradient-to-b from-black/80 via-black/40 to-black/0 backdrop-blur-md sticky top-0 z-20 border-b border-white/5 flex flex-col items-center">
          <div className="w-full flex items-center justify-center absolute top-8 px-6 left-0">
            <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase whitespace-nowrap">PROTOCOLS</h1>
          </div>
          
          <div className="mt-16 mb-4 flex flex-col items-center w-full px-4">
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black mb-4">SYSTEM STATUS: <span className="text-primary">LVL {user.level} ACTIVE</span></p>
            {/* 28 Dots directly under Status */}
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
              <button 
                  onClick={() => setActiveTab('library')}
                  className={cn(
                      "px-6 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 border-b-2",
                      activeTab === 'library' ? "border-primary text-primary font-black" : "border-transparent text-muted-foreground opacity-30"
                  )}
              >
                  Library
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
                        animate={{
                          opacity: 1,
                          y: 0,
                          x:
                            jiggleHabitId === habit.id
                              ? [0, -4, 4, -3, 3, 0]
                              : 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                          x: { duration: 0.22, ease: "easeOut" },
                        }}
                        onClick={() => handleHabitPress(habit.id)}
                        data-testid={`task-item-${habit.id}`}
                        className={cn(
                            "group relative overflow-hidden rounded-[20px] bg-card border p-6 cursor-pointer transition-all duration-300",
                            isCompleted 
                                ? "border-primary/40 shadow-[0_0_20px_rgba(204,255,0,0.05)]" 
                                : "border-white/5 hover:border-white/10"
                        )}
                        >
                        <AnimatePresence>
                          {flashHabitId === habit.id && (
                            <motion.div
                              key="flash"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.55, 0] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="absolute inset-0 bg-primary/15"
                            />
                          )}
                        </AnimatePresence>
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
            <div className="space-y-8 animate-in fade-in pb-10">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-2xl font-display font-black tracking-widest italic">PROTOCOLS</h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Manage your system</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" className="rounded-full h-12 w-12 bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all hover:scale-105 active:scale-95">
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
                                    className="bg-black/40 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-colors"
                                    placeholder="e.g. Cold Plunge"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">XP Value</label>
                                        <Input 
                                            type="number" 
                                            value={newHabit.xp} 
                                            onChange={(e) => setNewHabit({...newHabit, xp: Number(e.target.value)})} 
                                            className="bg-black/40 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Category</label>
                                        <Select 
                                            value={newHabit.category} 
                                            onValueChange={(v: any) => setNewHabit({ ...newHabit, category: v })}
                                        >
                                            <SelectTrigger className="bg-black/40 border-white/10 h-14 rounded-xl focus:border-primary/50 transition-colors"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-card border-white/10 text-foreground">
                                                <SelectItem value="routine">Routine</SelectItem>
                                                <SelectItem value="fitness">Fitness</SelectItem>
                                                <SelectItem value="health">Health</SelectItem>
                                                <SelectItem value="mindset">Mindset</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button onClick={handleAddHabit} className="w-full bg-primary text-black font-black uppercase h-16 rounded-xl mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Create Protocol</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-8">
                    {['routine', 'fitness', 'health', 'mindset'].map((category) => {
                        const categoryHabits = habits.filter(h => h.category === category);
                        if (categoryHabits.length === 0) return null;
                        
                        return (
                            <div key={category} className="space-y-3">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{category}</h3>
                                    <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                                </div>
                                
                                <div className="space-y-3">
                                    {categoryHabits.map((habit) => (
                                        <motion.div 
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={habit.id} 
                                            className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/20 transition-all active:scale-[0.99]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                                    category === 'fitness' ? "border-orange-500/20 text-orange-500 bg-orange-500/5" :
                                                    category === 'mindset' ? "border-purple-500/20 text-purple-500 bg-purple-500/5" :
                                                    category === 'health' ? "border-green-500/20 text-green-500 bg-green-500/5" :
                                                    "border-blue-500/20 text-blue-500 bg-blue-500/5"
                                                )}>
                                                    {category === 'fitness' ? <Zap size={18} /> : 
                                                     category === 'mindset' ? <Check size={18} /> :
                                                     <Plus size={18} />
                                                    }
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base">{habit.title}</h3>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-0.5">{habit.xp} XP</p>
                                                </div>
                                            </div>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={() => removeHabit(habit.id)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    
                    {habits.length === 0 && (
                        <div className="text-center py-20 px-6 border-2 border-dashed border-white/5 rounded-[40px]">
                            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-2">System Empty</p>
                            <p className="text-white/40 text-sm max-w-xs mx-auto">Click the + button to initialize your first protocol.</p>
                        </div>
                    )}
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
                        <div className="text-4xl font-display font-black text-primary">
                          +{user.todayCompletions.reduce((acc, id) => {
                            const h = habits.find(h => h.id === id);
                            return acc + (h ? h.xp : 0);
                          }, 0)}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 opacity-40">Streak</p>
                        <div className="text-4xl font-display font-black text-white">{user.streak}D</div>
                    </div>
                </div>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-4 animate-in fade-in pb-10">
              <div className="px-2 mb-6">
                <h2 className="text-xl font-display font-black tracking-widest italic mb-1">PROTOCOL LIBRARY</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Install pre-built systems</p>
              </div>

              {PROTOCOL_BUNDLES.map((bundle) => {
                const Icon = bundle.icon;
                const isInstalled = installedBundles.has(bundle.id);
                
                return (
                  <div
                    key={bundle.id}
                    className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-12 w-12 rounded-full flex items-center justify-center border-2",
                          bundle.color === "purple" && "border-purple-500/20 bg-purple-500/10 text-purple-500",
                          bundle.color === "red" && "border-red-500/20 bg-red-500/10 text-red-500",
                          bundle.color === "yellow" && "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                        )}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-lg tracking-tight">{bundle.name}</h3>
                          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{bundle.difficulty}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>

                    <div className="space-y-2 mb-4">
                      {bundle.habits.map((habit, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 bg-white/5 rounded-lg">
                          <span className="text-white/80">{habit.title}</span>
                          <span className="text-primary font-bold">+{habit.xp} XP</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleInstall(bundle)}
                      disabled={isInstalled || installMutation.isPending}
                      className={cn(
                        "w-full font-black uppercase tracking-wider h-12 rounded-xl transition-all",
                        isInstalled 
                          ? "bg-white/10 text-white/40 cursor-not-allowed" 
                          : "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                      )}
                    >
                      {isInstalled ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Installed
                        </>
                      ) : installMutation.isPending ? (
                        "Installing..."
                      ) : (
                        `Install ${bundle.habits.length} Habits`
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
