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
  profilePhoto?: string | null;
}

export interface Habit {
  id: number;
  userId: number;
  title: string;
  xp: number;
  category: 'health' | 'mindset' | 'fitness' | 'routine';
  createdAt: Date;
}


// User API
export async function getUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/user`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get user');
  return res.json();
}

// Habits API
export async function getHabits(): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits`, {
    credentials: 'include',
  });
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
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
}

export async function deleteHabit(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'DELETE',
    credentials: 'include',
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
  rank: number;
  profilePhoto?: string | null;
}> {
  const res = await fetch(`${API_BASE}/habits/${id}/toggle`, {
    method: 'POST',
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fail day');
  return res.json();
}

// Leaderboard API
export interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  profilePhoto?: string | null;
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to get leaderboard');
  return res.json();
}

export async function createBulkHabits(habits: { title: string; xp: number; category: string }[]): Promise<Habit[]> {
  const res = await fetch(`${API_BASE}/habits/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habits }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create bulk habits');
  return res.json();
}

// Settings API
export async function updateUserName(name: string): Promise<User> {
  const res = await fetch(`${API_BASE}/user/name`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update name');
  return res.json();
}

export async function exportUserData(): Promise<void> {
  const res = await fetch(`${API_BASE}/user/export`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to export data');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lockedin-data-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function uploadProfilePhoto(photoData: string): Promise<{ success: boolean; photoUrl: string }> {
  const res = await fetch(`${API_BASE}/user/photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoData }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to upload photo');
  return res.json();
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/user`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete account');
}
