import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, db } from "./storage";
import { users, habits, dailyCompletions, userProgress } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { setupAuth } from "./auth";



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
  
  setupAuth(app);

  // Get current user with progress
  app.get("/api/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const progress = await storage.getUserProgress(userId);
      const today = getTodayDate();
      const todayCompletions = await storage.getTodayCompletions(userId, today);
      
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
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get all habits
  app.get("/api/habits", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const habits = await storage.getHabits(userId);
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
      
      
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const data = schema.parse(req.body);
      const habit = await storage.createHabit(userId, data.title, data.xp, data.category);
      
      res.json(habit);
    } catch (error) {
      console.error("Create habit error:", error);
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Delete habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      // TODO: Verify habit belongs to user
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

      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      
      // Get current progress
      const progress = await storage.getUserProgress(userId);
      const habits = await storage.getHabits(userId);
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Toggle completion
      const isNowCompleted = await storage.toggleHabitCompletion(userId, habitId, today);
      
      // Update XP
      let newXp = progress?.currentXp || 0;
      if (isNowCompleted) {
        newXp += habit.xp;
      } else {
        newXp -= habit.xp;
      }
      
      await storage.updateUserProgress(userId, {
        currentXp: newXp,
      });
      
      // Get updated completions
      const todayCompletions = await storage.getTodayCompletions(userId, today);
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
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const progress = await storage.getUserProgress(userId);
      const sprintDays = JSON.parse(progress?.sprintDays || "[]");
      
      // Find next pending day
      const nextPendingIndex = sprintDays.findIndex((s: string) => s === 'pending');
      if (nextPendingIndex !== -1) {
        sprintDays[nextPendingIndex] = 'completed';
      }
      
      const today = getTodayDate();
      await storage.updateUserProgress(userId, {
        sprintDays: JSON.stringify(sprintDays),
        streak: (progress?.streak || 0) + 1,
        lastCompletedDate: today,
      });
      
      // Clear today's completions
      await storage.clearTodayCompletions(userId, today);
      
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
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const progress = await storage.getUserProgress(userId);
      const sprintDays = JSON.parse(progress?.sprintDays || "[]");
      
      // Find next pending day
      const nextPendingIndex = sprintDays.findIndex((s: string) => s === 'pending');
      if (nextPendingIndex !== -1) {
        sprintDays[nextPendingIndex] = 'failed';
      }
      
      const today = getTodayDate();
      await storage.updateUserProgress(userId, {
        sprintDays: JSON.stringify(sprintDays),
        streak: 0,
        lastCompletedDate: today,
      });
      
      // Clear today's completions
      await storage.clearTodayCompletions(userId, today);
      
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

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const leaderboard = await storage.getLeaderboard(limit);
      
      // Calculate level for each user
      const leaderboardWithLevel = leaderboard.map(entry => ({
        ...entry,
        level: Math.floor(entry.xp / 500),
      }));
      
      res.json(leaderboardWithLevel);
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Bulk create habits (for protocol library)
  app.post("/api/habits/bulk", async (req, res) => {
    try {
      const schema = z.object({
        habits: z.array(z.object({
          title: z.string().min(1),
          xp: z.number().min(1),
          category: z.enum(['health', 'mindset', 'fitness', 'routine']),
        })),
      });
      
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      const data = schema.parse(req.body);
      
      const createdHabits = [];
      for (const habit of data.habits) {
        const created = await storage.createHabit(userId, habit.title, habit.xp, habit.category);
        createdHabits.push(created);
      }
      
      res.json(createdHabits);
    } catch (error) {
      console.error("Bulk create habits error:", error);
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Settings endpoints
  app.put("/api/user/name", async (req, res) => {
    try {
      const schema = z.object({ name: z.string().min(1).max(50) });
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      
      const userId = (req.user as any).id;
      const { name } = schema.parse(req.body);
      
      // Update user name in database
      const updatedUser = await db.update(users).set({ name }).where(eq(users.id, userId)).returning();
      
      res.json(updatedUser[0]);
    } catch (error) {
      console.error("Update name error:", error);
      res.status(400).json({ message: "Invalid name" });
    }
  });

  app.get("/api/user/export", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      
      const user = await storage.getUser(userId);
      const habits = await storage.getHabits(userId);
      const progress = await storage.getUserProgress(userId);
      
      const exportData = {
        user,
        habits,
        progress,
        exportedAt: new Date().toISOString(),
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="lockedin-data-${userId}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error("Export data error:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Update profile photo
  app.post("/api/user/photo", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      
      const schema = z.object({
        photoData: z.string(), // base64 encoded image or URL
      });
      
      const { photoData } = schema.parse(req.body);
      
      await db.update(users)
        .set({ profilePhoto: photoData })
        .where(eq(users.id, userId));
      
      res.json({ success: true, photoUrl: photoData });
    } catch (error) {
      console.error("Update photo error:", error);
      res.status(500).json({ message: "Failed to update photo" });
    }
  });

  app.delete("/api/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const userId = (req.user as any).id;
      
      // Delete all user data
      await db.delete(dailyCompletions).where(eq(dailyCompletions.userId, userId));
      await db.delete(habits).where(eq(habits.userId, userId));
      await db.delete(userProgress).where(eq(userProgress.userId, userId));
      await db.delete(users).where(eq(users.id, userId));
      
      // Logout
      req.logout(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  return httpServer;
}
