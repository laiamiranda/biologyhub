const API_BASE = 'http://localhost:4000/api';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface Track {
  id: string;
  category_id: string;
  title: string;
  description: string;
  track_number: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  track_id: string;
  title: string;
  content: string;
  content_type: 'article' | 'video' | 'interactive' | 'quiz';
  order_index: number;
  duration_minutes: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  options: { id: string; text: string }[];
  correct_answer: string;
  explanation: string;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  track_id: string;
  lesson_id: string;
  completed: boolean;
  score: number | null;
  completed_at: string | null;
  created_at: string;
}

// API client functions
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getTracks(filters?: { category_id?: string; difficulty?: string }): Promise<Track[]> {
  const params = new URLSearchParams();
  if (filters?.category_id) params.append('category_id', filters.category_id);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  
  const response = await fetch(`${API_BASE}/tracks?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch tracks');
  return response.json();
}

// For now, return empty arrays for lessons and quiz questions
// These will be implemented when we add those endpoints
export async function getLessons(trackId: string): Promise<Lesson[]> {
  return [];
}

export async function getQuizQuestions(lessonId: string): Promise<QuizQuestion[]> {
  return [];
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  return [];
}

export async function updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
  // For now, just log - will implement when we add progress endpoints
  console.log('Progress update:', progress);
}

export async function upsertUserProgress(progress: Partial<UserProgress>): Promise<void> {
  return updateUserProgress(progress);
}
