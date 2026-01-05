import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const SINGLE_USER_ID = 1; // For MVP, we use a single user

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to calculate level and next level XP
function calculateLevel(xp: number): { level: number; nextLevelXp: number } {
  const level = Math.floor(xp / 500);
  const nextLevelXp = (level + 1) * 500;
  return { level, nextLevelXp };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize default user and habits on first run
  app.get("/api/init", async (req, res) => {
    try {
      let user = await storage.getUser(SINGLE_USER_ID);
      
      if (!user) {
        // Create default user
        user = await storage.createUser({
          username: "guest",
          name: "Guest User",
        });
        
        // Create default habits
        const defaultHabits = [
          { title: 'Wake up at 5 AM', xp: 50, category: 'routine' },
          { title: 'Cold shower', xp: 40, category: 'health' },
          { title: 'Write in journal', xp: 30, category: 'mindset' },
          { title: 'No social media', xp: 45, category: 'mindset' },
          { title: 'Practice gratitude', xp: 35, category: 'mindset' },
          { title: 'Eat clean', xp: 45, category: 'health' },
          { title: '8 hours sleep', xp: 40, category: 'health' },
          { title: '45min Workout', xp: 60, category: 'fitness' },
        ];
        
        for (const habit of defaultHabits) {
          await storage.createHabit(user.id, habit.title, habit.xp, habit.category);
        }
        
        // Initialize user progress
        await storage.updateUserProgress(user.id, {
          currentXp: 120,
          level: 0,
          streak: 3,
          sprintDays: JSON.stringify(Array(28).fill('pending').map((s: string, i: number) => i < 2 ? 'completed' : s)),
          lastCompletedDate: null,
        });
      }
      
      res.json({ success: true, userId: user.id });
    } catch (error) {
      console.error("Init error:", error);
      res.status(500).json({ message: "Failed to initialize" });
    }
  });

  // Get current user with progress
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(SINGLE_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progress = await storage.getUserProgress(SINGLE_USER_ID);
      const today = getTodayDate();
      const todayCompletions = await storage.getTodayCompletions(SINGLE_USER_ID, today);
      
      const { level, nextLevelXp } = calculateLevel(progress?.currentXp || 0);
      
      res.json({
        id: user.id,
        name: user.name,
        level,
        currentXp: progress?.currentXp || 0,
        nextLevelXp,
        streak: progress?.streak || 0,
        todayCompletions,
        sprintDays: JSON.parse(progress?.sprintDays || "[]"),
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get all habits
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabits(SINGLE_USER_ID);
      res.json(habits);
    } catch (error) {
      console.error("Get habits error:", error);
      res.status(500).json({ message: "Failed to get habits" });
    }
  });

  // Create new habit
  app.post("/api/habits", async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        xp: z.number().min(1),
        category: z.enum(['health', 'mindset', 'fitness', 'routine']),
      });
      
      const data = schema.parse(req.body);
      const habit = await storage.createHabit(SINGLE_USER_ID, data.title, data.xp, data.category);
      
      res.json(habit);
    } catch (error) {
      console.error("Create habit error:", error);
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Delete habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      await storage.deleteHabit(habitId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete habit error:", error);
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Toggle habit completion
  app.post("/api/habits/:id/toggle", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const today = getTodayDate();
      
      // Get current progress
      const progress = await storage.getUserProgress(SINGLE_USER_ID);
      const habits = await storage.getHabits(SINGLE_USER_ID);
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Toggle completion
      const isNowCompleted = await storage.toggleHabitCompletion(SINGLE_USER_ID, habitId, today);
      
      // Update XP
      let newXp = progress?.currentXp || 0;
      if (isNowCompleted) {
        newXp += habit.xp;
      } else {
        newXp -= habit.xp;
      }
      
      await storage.updateUserProgress(SINGLE_USER_ID, {
        currentXp: newXp,
      });
      
      // Get updated completions
      const todayCompletions = await storage.getTodayCompletions(SINGLE_USER_ID, today);
      const { level, nextLevelXp } = calculateLevel(newXp);
      
      res.json({
        success: true,
        completed: isNowCompleted,
        todayCompletions,
        currentXp: newXp,
        level,
        nextLevelXp,
      });
    } catch (error) {
      console.error("Toggle habit error:", error);
      res.status(500).json({ message: "Failed to toggle habit" });
    }
  });

  // Complete day
  app.post("/api/day/complete", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(SINGLE_USER_ID);
      const sprintDays = JSON.parse(progress?.sprintDays || "[]");
      
      // Find next pending day
      const nextPendingIndex = sprintDays.findIndex((s: string) => s === 'pending');
      if (nextPendingIndex !== -1) {
        sprintDays[nextPendingIndex] = 'completed';
      }
      
      const today = getTodayDate();
      await storage.updateUserProgress(SINGLE_USER_ID, {
        sprintDays: JSON.stringify(sprintDays),
        streak: (progress?.streak || 0) + 1,
        lastCompletedDate: today,
      });
      
      // Clear today's completions
      await storage.clearTodayCompletions(SINGLE_USER_ID, today);
      
      res.json({
        success: true,
        sprintDays,
        streak: (progress?.streak || 0) + 1,
      });
    } catch (error) {
      console.error("Complete day error:", error);
      res.status(500).json({ message: "Failed to complete day" });
    }
  });

  // Fail day
  app.post("/api/day/fail", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(SINGLE_USER_ID);
      const sprintDays = JSON.parse(progress?.sprintDays || "[]");
      
      // Find next pending day
      const nextPendingIndex = sprintDays.findIndex((s: string) => s === 'pending');
      if (nextPendingIndex !== -1) {
        sprintDays[nextPendingIndex] = 'failed';
      }
      
      const today = getTodayDate();
      await storage.updateUserProgress(SINGLE_USER_ID, {
        sprintDays: JSON.stringify(sprintDays),
        streak: 0,
        lastCompletedDate: today,
      });
      
      // Clear today's completions
      await storage.clearTodayCompletions(SINGLE_USER_ID, today);
      
      res.json({
        success: true,
        sprintDays,
        streak: 0,
      });
    } catch (error) {
      console.error("Fail day error:", error);
      res.status(500).json({ message: "Failed to mark day as failed" });
    }
  });

  return httpServer;
}
