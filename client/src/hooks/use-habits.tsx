import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/lib/api';

export type Habit = {
  id: number;
  title: string;
  xp: number;
  category: 'health' | 'mindset' | 'fitness' | 'routine';
};

export type DayStatus = 'pending' | 'completed' | 'failed';

export type User = {
  id: number;
  name: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  todayCompletions: number[]; // array of habit IDs
  sprintDays: DayStatus[]; // 28 days status
  profilePhoto?: string | null;
};

type HabitsContextType = {
  habits: Habit[];
  user: User;
  toggleHabit: (habitId: number) => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  removeHabit: (habitId: number) => void;
  completeDay: () => void;
  failDay: () => void;
  isQuickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;
  isLoading: boolean;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 0,
  name: 'Guest User',
  level: 0,
  currentXp: 0,
  nextLevelXp: 500,
  streak: 0,
  todayCompletions: [],
  sprintDays: Array(28).fill('pending'),
  profilePhoto: null,
};

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [isQuickActionOpen, setQuickActionOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // No separate initApp needed now as data is initialized on registration
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: api.getUser,
    enabled: initialized,
    refetchOnWindowFocus: false,
  });

  // Don't fallback to DEFAULT_USER - let auth redirect handle it
  const user = userData || DEFAULT_USER;

  // Fetch habits
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
    enabled: initialized && !!userData,
    refetchOnWindowFocus: false,
  });

  // Toggle habit mutation
  const toggleMutation = useMutation({
    mutationFn: api.toggleHabit,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], (old: User | undefined) => {
        if (!old) return old;
        
        // Check if level increased
        if (data.level > old.level) {
          toast({
            title: "LEVEL UP!",
            description: `You reached Level ${data.level}`,
            className: "bg-primary text-primary-foreground border-none font-display uppercase tracking-wider"
          });
        }
        
        return {
          ...old,
          todayCompletions: data.todayCompletions,
          currentXp: data.currentXp,
          level: data.level,
          nextLevelXp: data.nextLevelXp,
        };
      });
    },
  });

  // Add habit mutation
  const addMutation = useMutation({
    mutationFn: api.createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({ title: "Habit Added", description: "Time to lock in." });
    },
  });

  // Remove habit mutation
  const removeMutation = useMutation({
    mutationFn: api.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Complete day mutation
  const completeDayMutation = useMutation({
    mutationFn: api.completeDay,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], (old: User | undefined) => {
        if (!old) return old;
        return {
          ...old,
          sprintDays: data.sprintDays,
          streak: data.streak,
          todayCompletions: [],
        };
      });
      toast({
        title: "DAY COMPLETE",
        description: "Sprint progress recorded.",
        className: "bg-primary text-primary-foreground border-none font-display uppercase tracking-wider"
      });
    },
  });

  // Fail day mutation
  const failDayMutation = useMutation({
    mutationFn: api.failDay,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], (old: User | undefined) => {
        if (!old) return old;
        return {
          ...old,
          sprintDays: data.sprintDays,
          streak: data.streak,
          todayCompletions: [],
        };
      });
      toast({
        title: "FAILED",
        description: "Sprint day marked as failed. Resetting streak.",
        variant: "destructive",
        className: "uppercase font-display tracking-wider"
      });
    },
  });

  const toggleHabit = (habitId: number) => {
    toggleMutation.mutate(habitId);
  };

  const addHabit = (newHabit: Omit<Habit, 'id'>) => {
    addMutation.mutate(newHabit);
  };

  const removeHabit = (habitId: number) => {
    removeMutation.mutate(habitId);
  };

  const completeDay = () => {
    completeDayMutation.mutate();
  };

  const failDay = () => {
    failDayMutation.mutate();
  };

  const isLoading = !initialized || userLoading || habitsLoading;

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      user, 
      toggleHabit, 
      addHabit, 
      removeHabit, 
      completeDay, 
      failDay, 
      isQuickActionOpen, 
      setQuickActionOpen,
      isLoading,
    }}>
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
