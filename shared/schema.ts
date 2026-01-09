import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().default("Guest User"),
  profilePhoto: text("profile_photo"), // URL or path to profile photo
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Habits table
export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  xp: integer("xp").notNull().default(50),
  category: text("category", { enum: ["health", "mindset", "fitness", "routine"] }).notNull().default("routine"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Daily completions table
export const dailyCompletions = sqliteTable("daily_completions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  habitId: integer("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  completedAt: integer("completed_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  date: text("date").notNull(), // YYYY-MM-DD format for easy querying
});

// User progress table
export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  currentXp: integer("current_xp").notNull().default(0),
  level: integer("level").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  sprintDays: text("sprint_days").notNull().default("[]"), // JSON array of 28 days
  lastCompletedDate: text("last_completed_date"), // YYYY-MM-DD format
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertHabitSchema = createInsertSchema(habits).pick({
  title: true,
  xp: true,
  category: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type DailyCompletion = typeof dailyCompletions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
