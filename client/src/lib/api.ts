// API client for backend communication

const API_BASE = "/api";

export interface User {
  id: number;
  name: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  todayCompletions: number[];
  sprintDays: ('pending' | 'completed' | 'failed')[];
}

export interface Habit {
  id: number;
  userId: number;
  title: string;
  xp: number;
  category: 'health' | 'mindset' | 'fitness' | 'routine';
  createdAt: Date;
}

// Initialize app (create default user and habits if needed)
export async function initApp(): Promise<void> {
  const res = await fetch(`${API_BASE}/init`);
  if (!res.ok) throw new Error('Failed to initialize app');
}

// User API
export async function getUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/user`);
  if (!res.ok) throw new Error('Failed to get user');
  return res.json();
}

// Habits API
export async function getHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits`);
  if (!res.ok) throw new Error('Failed to get habits');
  return res.json();
}

export async function createHabit(data: {
  title: string;
  xp: number;
  category: string;
}): Promise<Habit> {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function deleteHabit(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete habit');
}

export async function toggleHabit(id: number): Promise<{
  success: boolean;
  completed: boolean;
  todayCompletions: number[];
  currentXp: number;
  level: number;
  nextLevelXp: number;
}> {
  const res = await fetch(`${API_BASE}/habits/${id}/toggle`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle habit');
  return res.json();
}

// Day completion API
export async function completeDay(): Promise<{
  success: boolean;
  sprintDays: ('pending' | 'completed' | 'failed')[];
  streak: number;
}> {
  const res = await fetch(`${API_BASE}/day/complete`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to complete day');
  return res.json();
}

export async function failDay(): Promise<{
  success: boolean;
  sprintDays: ('pending' | 'completed' | 'failed')[];
  streak: number;
}> {
  const res = await fetch(`${API_BASE}/day/fail`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to fail day');
  return res.json();
}
