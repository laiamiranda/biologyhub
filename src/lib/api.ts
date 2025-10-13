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
  try {
    console.log('Fetching categories from:', `${API_BASE}/categories`);
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) {
      console.error('Categories API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Categories fetched successfully:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('Categories fetch error:', error);
    throw error;
  }
}

export async function getTracks(filters?: { category_id?: string; difficulty?: string }): Promise<Track[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    const url = `${API_BASE}/tracks?${params.toString()}`;
    console.log('Fetching tracks from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Tracks API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Tracks fetched successfully:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('Tracks fetch error:', error);
    throw error;
  }
}

// For now, return empty arrays for lessons and quiz questions
// These will be implemented when we add those endpoints
export async function getLessons(trackId: string): Promise<Lesson[]> {
  // Temporary mock until lessons API exists
  const now = new Date().toISOString();
  return [
    {
      id: `${trackId}-l1`,
      track_id: trackId,
      title: 'Introduction',
      content: '<p>Overview of key concepts.</p>',
      content_type: 'article',
      order_index: 1,
      duration_minutes: 20,
      created_at: now,
    },
    {
      id: `${trackId}-l2`,
      track_id: trackId,
      title: 'Core Ideas',
      content: '<p>Deep dive into fundamentals.</p>',
      content_type: 'article',
      order_index: 2,
      duration_minutes: 30,
      created_at: now,
    },
    {
      id: `${trackId}-l3`,
      track_id: trackId,
      title: 'Checkpoint Quiz',
      content: '<p>Test your knowledge.</p>',
      content_type: 'quiz',
      order_index: 3,
      duration_minutes: 10,
      created_at: now,
    },
  ];
}

export async function getQuizQuestions(lessonId: string): Promise<QuizQuestion[]> {
  // Temporary mock until quizzes API exists
  const now = new Date().toISOString();
  return [
    {
      id: `${lessonId}-q1`,
      lesson_id: lessonId,
      question_text: 'Which statement is true?',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correct_answer: 'b',
      explanation: 'B is correct based on the lesson content.',
      order_index: 1,
      created_at: now,
    },
    {
      id: `${lessonId}-q2`,
      lesson_id: lessonId,
      question_text: 'Select the best definition.',
      options: [
        { id: 'a', text: 'Definition A' },
        { id: 'b', text: 'Definition B' },
        { id: 'c', text: 'Definition C' },
        { id: 'd', text: 'Definition D' },
      ],
      correct_answer: 'a',
      explanation: 'A matches the terminology used.',
      order_index: 2,
      created_at: now,
    },
  ];
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  // Minimal mock to allow progress UI to render
  return [];
}

export async function updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
  // For now, just log - will implement when we add progress endpoints
  console.log('Progress update:', progress);
}

export async function upsertUserProgress(progress: Partial<UserProgress>): Promise<void> {
  return updateUserProgress(progress);
}
