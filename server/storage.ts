import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { 
  users, 
  habits, 
  dailyCompletions, 
  userProgress,
  type User, 
  type Habit,
  type UserProgress,
  type InsertUser 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, "app.db"));
export const db = drizzle(sqlite);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  initializeUserData(userId: number): Promise<void>;
  
  // Habit methods
  getHabits(userId: number): Promise<Habit[]>;
  createHabit(userId: number, title: string, xp: number, category: string): Promise<Habit>;
  deleteHabit(habitId: number): Promise<void>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, data: Partial<UserProgress>): Promise<UserProgress>;
  
  // Daily completion methods
  getTodayCompletions(userId: number, date: string): Promise<number[]>; // Returns habit IDs
  toggleHabitCompletion(userId: number, habitId: number, date: string): Promise<boolean>; // Returns new state
  clearTodayCompletions(userId: number, date: string): Promise<void>;
  
  // Leaderboard
  getLeaderboard(limit: number): Promise<{ id: number; name: string; xp: number; streak: number; rank: number }[]>;
}

export class DrizzleStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Habit methods
  async getHabits(userId: number): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(userId: number, title: string, xp: number, category: string): Promise<Habit> {
    const result = await db.insert(habits).values({
      userId,
      title,
      xp,
      category: category as any,
    }).returning();
    return result[0];
  }

  async deleteHabit(habitId: number): Promise<void> {
    await db.delete(habits).where(eq(habits.id, habitId));
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return result[0];
  }

  async updateUserProgress(userId: number, data: Partial<UserProgress>): Promise<UserProgress> {
    // Check if progress exists
    const existing = await this.getUserProgress(userId);
    
    if (existing) {
      const result = await db
        .update(userProgress)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userProgress.userId, userId))
        .returning();
      return result[0];
    } else {
      // Create new progress
      const result = await db
        .insert(userProgress)
        .values({
          userId,
          currentXp: data.currentXp || 0,
          level: data.level || 0,
          streak: data.streak || 0,
          sprintDays: data.sprintDays || "[]",
          lastCompletedDate: data.lastCompletedDate || null,
        })
        .returning();
      return result[0];
    }
  }

  // Daily completion methods
  async getTodayCompletions(userId: number, date: string): Promise<number[]> {
    const completions = await db
      .select()
      .from(dailyCompletions)
      .where(and(eq(dailyCompletions.userId, userId), eq(dailyCompletions.date, date)));
    
    return completions.map(c => c.habitId);
  }

  async toggleHabitCompletion(userId: number, habitId: number, date: string): Promise<boolean> {
    // Check if already completed today
    const existing = await db
      .select()
      .from(dailyCompletions)
      .where(
        and(
          eq(dailyCompletions.userId, userId),
          eq(dailyCompletions.habitId, habitId),
          eq(dailyCompletions.date, date)
        )
      );

    if (existing.length > 0) {
      // Remove completion
      await db
        .delete(dailyCompletions)
        .where(eq(dailyCompletions.id, existing[0].id));
      return false; // Now uncompleted
    } else {
      // Add completion
      await db.insert(dailyCompletions).values({
        userId,
        habitId,
        date,
      });
      return true; // Now completed
    }
  }

  async clearTodayCompletions(userId: number, date: string): Promise<void> {
    await db
      .delete(dailyCompletions)
      .where(and(eq(dailyCompletions.userId, userId), eq(dailyCompletions.date, date)));
  }
  async initializeUserData(userId: number): Promise<void> {
    // Create default habits
    const defaultHabits = [
      { title: 'Wake up at 5 AM', xp: 50, category: 'routine' as const },
      { title: 'Cold shower', xp: 40, category: 'health' as const },
      { title: 'Write in journal', xp: 30, category: 'mindset' as const },
      { title: 'No social media', xp: 45, category: 'mindset' as const },
      { title: 'Practice gratitude', xp: 35, category: 'mindset' as const },
      { title: 'Eat clean', xp: 45, category: 'health' as const },
      { title: '8 hours sleep', xp: 40, category: 'health' as const },
      { title: '45min Workout', xp: 60, category: 'fitness' as const },
    ];
    
    for (const habit of defaultHabits) {
      await this.createHabit(userId, habit.title, habit.xp, habit.category);
    }
    
    // Initialize user progress
    await this.updateUserProgress(userId, {
      currentXp: 120,
      level: 0,
      streak: 3,
      sprintDays: JSON.stringify(Array(28).fill('pending').map((s: string, i: number) => i < 2 ? 'completed' : s)),
      lastCompletedDate: null,
    });
  }

  // Leaderboard method
  async getLeaderboard(limit: number): Promise<{ id: number; name: string; xp: number; streak: number; rank: number }[]> {
    // Join users with their progress, order by XP descending
    const results = await db
      .select({
        id: users.id,
        name: users.name,
        xp: userProgress.currentXp,
        streak: userProgress.streak,
      })
      .from(users)
      .leftJoin(userProgress, eq(users.id, userProgress.userId))
      .orderBy(desc(userProgress.currentXp))
      .limit(limit);

    // Add rank to each entry
    return results.map((entry, index) => ({
      id: entry.id,
      name: entry.name,
      xp: entry.xp || 0,
      streak: entry.streak || 0,
      rank: index + 1,
    }));
  }
}

export const storage = new DrizzleStorage();
