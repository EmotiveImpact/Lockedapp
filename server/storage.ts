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
}

export const storage = new DrizzleStorage();
