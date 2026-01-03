import { useHabits } from "@/hooks/use-habits";
import { XPProgress } from "@/components/xp-progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { habits, user, toggleHabit, completeDay } = useHabits();

  // Sort: Incomplete first, then completed
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = user.todayCompletions.includes(a.id);
    const bCompleted = user.todayCompletions.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  const progress = (user.todayCompletions.length / habits.length) * 100;

  return (
    <div className="flex flex-col min-h-full">
      <XPProgress current={user.currentXp} total={user.nextLevelXp} level={user.level} />

      <div className="flex-1 px-4 pb-8 space-y-6">
        
        {/* Tabs Visual (Static for now as we use bottom nav for main switches) */}
        <div className="flex border-b border-white/10 mb-6">
            <div className="px-4 py-2 border-b-2 border-primary text-foreground font-bold text-sm uppercase tracking-wider">Today</div>
            <div className="px-4 py-2 text-muted-foreground font-medium text-sm uppercase tracking-wider opacity-50">Habits</div>
            <div className="px-4 py-2 text-muted-foreground font-medium text-sm uppercase tracking-wider opacity-50">XP</div>
        </div>

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
                  
                  {/* Progress fill background */}
                  {isCompleted && (
                      <motion.div 
                        layoutId={`fill-${habit.id}`}
                        className="absolute inset-0 bg-primary/5 z-0" 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                      />
                  )}
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
                className="w-full text-muted-foreground hover:text-white hover:bg-white/5 font-medium h-12 rounded-xl"
            >
                I Failed
            </Button>
        </div>

      </div>
    </div>
  );
}
