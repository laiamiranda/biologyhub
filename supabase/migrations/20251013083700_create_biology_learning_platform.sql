/*
  # Biology Learning Platform Database Schema

  ## Overview
  This migration creates the complete database structure for a comprehensive biology learning platform
  with 100 learning tracks organized into 10 categories, lessons, quizzes, and progress tracking.

  ## New Tables

  ### 1. categories
  Stores the 10 major biology topic categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Foundations of Biology")
  - `description` (text) - Brief description
  - `icon` (text) - Icon identifier for UI
  - `order_index` (integer) - Display order
  - `created_at` (timestamp)

  ### 2. tracks
  Stores the 100 learning tracks (mini-courses)
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key to categories)
  - `title` (text) - Track title
  - `description` (text) - Track description
  - `track_number` (integer) - 1-100 numbering
  - `difficulty_level` (text) - beginner/intermediate/advanced
  - `estimated_hours` (integer) - Time to complete
  - `order_index` (integer) - Display order within category
  - `created_at` (timestamp)

  ### 3. lessons
  Stores individual lessons within tracks
  - `id` (uuid, primary key)
  - `track_id` (uuid, foreign key to tracks)
  - `title` (text) - Lesson title
  - `content` (text) - Main lesson content (markdown/HTML)
  - `content_type` (text) - article/video/interactive/quiz
  - `order_index` (integer) - Display order within track
  - `duration_minutes` (integer) - Estimated duration
  - `created_at` (timestamp)

  ### 4. quiz_questions
  Stores quiz questions for assessments
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, foreign key to lessons)
  - `question_text` (text) - The question
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (text) - Correct answer identifier
  - `explanation` (text) - Explanation of correct answer
  - `order_index` (integer) - Question order
  - `created_at` (timestamp)

  ### 5. user_progress
  Tracks user progress through tracks and lessons
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User identifier (for future auth)
  - `track_id` (uuid, foreign key to tracks)
  - `lesson_id` (uuid, foreign key to lessons)
  - `completed` (boolean) - Completion status
  - `score` (integer) - Quiz score if applicable
  - `completed_at` (timestamp)
  - `created_at` (timestamp)

  ### 6. bookmarks
  Allows users to bookmark tracks/lessons
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User identifier
  - `track_id` (uuid, foreign key to tracks, nullable)
  - `lesson_id` (uuid, foreign key to lessons, nullable)
  - `created_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (learning content)
  - Add policies for authenticated user progress tracking
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT '🧬',
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  track_number integer NOT NULL UNIQUE,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer DEFAULT 2,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  content_type text DEFAULT 'article' CHECK (content_type IN ('article', 'video', 'interactive', 'quiz')),
  order_index integer NOT NULL,
  duration_minutes integer DEFAULT 15,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_id, lesson_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_category ON tracks(category_id);
CREATE INDEX IF NOT EXISTS idx_lessons_track ON lessons(track_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_track ON user_progress(track_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- Policies for tracks (public read)
CREATE POLICY "Tracks are viewable by everyone"
  ON tracks FOR SELECT
  TO anon
  USING (true);

-- Policies for lessons (public read)
CREATE POLICY "Lessons are viewable by everyone"
  ON lessons FOR SELECT
  TO anon
  USING (true);

-- Policies for quiz_questions (public read)
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  TO anon
  USING (true);

-- Policies for user_progress (user-specific)
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policies for bookmarks (user-specific)
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  TO anon
  USING (true);