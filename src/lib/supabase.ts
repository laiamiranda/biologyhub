// Supabase has been replaced with MySQL REST API
// This file is kept for type exports only

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
};

export type Track = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  track_number: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  order_index: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  track_id: string;
  title: string;
  content: string;
  content_type: 'article' | 'video' | 'interactive' | 'quiz';
  order_index: number;
  duration_minutes: number;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  question_text: string;
  options: { id: string; text: string }[];
  correct_answer: string;
  explanation: string;
  order_index: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  track_id: string;
  lesson_id: string;
  completed: boolean;
  score: number | null;
  completed_at: string | null;
  created_at: string;
};
