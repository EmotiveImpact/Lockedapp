import { useState, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Habit = {
  id: string;
  title: string;
  xp: number;
  category: 'health' | 'mindset' | 'fitness' | 'routine';
};

export type DayStatus = 'pending' | 'completed' | 'failed';

export type User = {
  name: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  todayCompletions: string[]; // array of habit IDs
  sprintDays: DayStatus[]; // 28 days status
};

type HabitsContextType = {
  habits: Habit[];
  user: User;
  toggleHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  removeHabit: (habitId: string) => void;
  completeDay: () => void;
  failDay: () => void;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const INITIAL_HABITS: Habit[] = [
  { id: '1', title: 'Wake up at 5 AM', xp: 50, category: 'routine' },
  { id: '2', title: 'Cold shower', xp: 40, category: 'health' },
  { id: '3', title: 'Write in journal', xp: 30, category: 'mindset' },
  { id: '4', title: 'No social media', xp: 45, category: 'mindset' },
  { id: '5', title: 'Practice gratitude', xp: 35, category: 'mindset' },
  { id: '6', title: 'Eat clean', xp: 45, category: 'health' },
  { id: '7', title: '8 hours sleep', xp: 40, category: 'health' },
  { id: '8', title: '45min Workout', xp: 60, category: 'fitness' },
];

const INITIAL_USER: User = {
  name: 'Guest User',
  level: 0,
  currentXp: 120,
  nextLevelXp: 500,
  streak: 3,
  todayCompletions: [],
  sprintDays: Array(28).fill('pending').map((s, i) => i < 2 ? 'completed' : s), // Start with 2 completed
};

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const { toast } = useToast();

  const toggleHabit = (habitId: string) => {
    setUser((prev) => {
      const isCompleted = prev.todayCompletions.includes(habitId);
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return prev;

      let newXp = prev.currentXp;
      let newCompletions = [...prev.todayCompletions];

      if (isCompleted) {
        newXp -= habit.xp;
        newCompletions = newCompletions.filter((id) => id !== habitId);
      } else {
        newXp += habit.xp;
        newCompletions.push(habitId);
        
        if (newXp >= prev.nextLevelXp) {
           toast({
             title: "LEVEL UP!",
             description: `You reached Level ${prev.level + 1}`,
             className: "bg-primary text-primary-foreground border-none font-display uppercase tracking-wider"
           });
        }
      }
      
      const level = Math.floor(newXp / 500);
      const nextLevelXp = (level + 1) * 500;

      return {
        ...prev,
        currentXp: newXp,
        level,
        nextLevelXp,
        todayCompletions: newCompletions,
      };
    });
  };

  const addHabit = (newHabit: Omit<Habit, 'id'>) => {
    const habit = { ...newHabit, id: Math.random().toString(36).substr(2, 9) };
    setHabits((prev) => [...prev, habit]);
    toast({ title: "Habit Added", description: "Time to lock in." });
  };

  const removeHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const completeDay = () => {
    setUser(prev => {
        const nextPendingIndex = prev.sprintDays.findIndex(s => s === 'pending');
        if (nextPendingIndex === -1) return prev;
        
        const newSprintDays = [...prev.sprintDays];
        newSprintDays[nextPendingIndex] = 'completed';
        
        return {
            ...prev,
            sprintDays: newSprintDays,
            todayCompletions: [],
            streak: prev.streak + 1
        };
    });
    toast({
        title: "DAY COMPLETE",
        description: "Sprint progress recorded.",
        className: "bg-primary text-primary-foreground border-none font-display uppercase tracking-wider"
    });
  };

  const failDay = () => {
    setUser(prev => {
        const nextPendingIndex = prev.sprintDays.findIndex(s => s === 'pending');
        if (nextPendingIndex === -1) return prev;
        
        const newSprintDays = [...prev.sprintDays];
        newSprintDays[nextPendingIndex] = 'failed';
        
        return {
            ...prev,
            sprintDays: newSprintDays,
            todayCompletions: [],
            streak: 0
        };
    });
    toast({
        title: "FAILED",
        description: "Sprint day marked as failed. Resetting streak.",
        variant: "destructive",
        className: "uppercase font-display tracking-wider"
    });
  };

  return (
    <HabitsContext.Provider value={{ habits, user, toggleHabit, addHabit, removeHabit, completeDay, failDay }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
