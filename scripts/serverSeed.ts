import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { categoriesData, tracksData, lessonsData, quizQuestionsData } from '../src/lib/seedData';

// Load .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    if (!line || line.trim().startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1);
      if (key) process.env[key] = val;
    }
  });
} catch {}

const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE as string;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

async function main() {
  console.log('Seeding start...');

  // Idempotency: check if categories exist
  const { data: existing } = await admin.from('categories').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Already seeded. Exiting.');
    return;
  }

  const { data: categories, error: catErr } = await admin
    .from('categories')
    .insert(categoriesData)
    .select();
  if (catErr) throw catErr;
  console.log(`Inserted ${categories.length} categories`);

  const tracksToInsert = tracksData.map((t) => ({
    category_id: categories[t.category_idx].id,
    title: t.title,
    description: t.description,
    track_number: t.track_number,
    difficulty_level: t.difficulty_level,
    estimated_hours: t.estimated_hours,
    order_index: t.track_number,
  }));
  const { data: tracks, error: trErr } = await admin.from('tracks').insert(tracksToInsert).select();
  if (trErr) throw trErr;
  console.log(`Inserted ${tracks.length} tracks`);

  const lessonsToInsert: any[] = [];
  lessonsData.forEach((trackLessons) => {
    const track = tracks.find((x) => x.track_number === trackLessons.track_number);
    if (!track) return;
    trackLessons.lessons.forEach((lesson) => {
      lessonsToInsert.push({
        track_id: track.id,
        title: lesson.title,
        content: lesson.content,
        content_type: lesson.content_type,
        duration_minutes: lesson.duration_minutes,
        order_index: lesson.order_index,
      });
    });
  });
  const { data: lessons, error: leErr } = await admin.from('lessons').insert(lessonsToInsert).select();
  if (leErr) throw leErr;
  console.log(`Inserted ${lessons.length} lessons`);

  const quizToInsert: any[] = [];
  quizQuestionsData.forEach((qset) => {
    const track = tracks.find((t) => t.track_number === qset.track_number);
    if (!track) return;
    const trackLessons = lessons.filter((l) => l.track_id === track.id);
    const lesson = trackLessons[qset.lesson_index - 1];
    if (!lesson) return;
    qset.questions.forEach((q) => {
      quizToInsert.push({
        lesson_id: lesson.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        order_index: q.order_index,
      });
    });
  });
  if (quizToInsert.length) {
    const { error: qqErr } = await admin.from('quiz_questions').insert(quizToInsert);
    if (qqErr) throw qqErr;
    console.log(`Inserted ${quizToInsert.length} quiz questions`);
  }

  console.log('Seeding complete.');
}

main().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
