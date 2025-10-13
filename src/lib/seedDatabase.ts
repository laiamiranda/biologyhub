import { supabase } from './supabase';
import { categoriesData, tracksData, lessonsData, quizQuestionsData } from './seedData';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    const { data: existingCategories } = await supabase.from('categories').select('id').limit(1);

    if (existingCategories && existingCategories.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categoriesData)
      .select();

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }

    console.log(`✓ Inserted ${categories.length} categories`);

    const tracksToInsert = tracksData.map((track) => ({
      category_id: categories[track.category_idx].id,
      title: track.title,
      description: track.description,
      track_number: track.track_number,
      difficulty_level: track.difficulty_level,
      estimated_hours: track.estimated_hours,
      order_index: track.track_number,
    }));

    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .insert(tracksToInsert)
      .select();

    if (tracksError) {
      console.error('Error inserting tracks:', tracksError);
      return;
    }

    console.log(`✓ Inserted ${tracks.length} tracks`);

    const lessonsToInsert: any[] = [];
    lessonsData.forEach((trackLessons) => {
      const track = tracks.find((t) => t.track_number === trackLessons.track_number);
      if (track) {
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
      }
    });

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .insert(lessonsToInsert)
      .select();

    if (lessonsError) {
      console.error('Error inserting lessons:', lessonsError);
      return;
    }

    console.log(`✓ Inserted ${lessons.length} lessons`);

    const quizQuestionsToInsert: any[] = [];
    quizQuestionsData.forEach((trackQuiz) => {
      const track = tracks.find((t) => t.track_number === trackQuiz.track_number);
      if (track) {
        const trackLessons = lessons.filter((l) => l.track_id === track.id);
        const lesson = trackLessons[trackQuiz.lesson_index - 1];

        if (lesson) {
          trackQuiz.questions.forEach((question) => {
            quizQuestionsToInsert.push({
              lesson_id: lesson.id,
              question_text: question.question_text,
              options: question.options,
              correct_answer: question.correct_answer,
              explanation: question.explanation,
              order_index: question.order_index,
            });
          });
        }
      }
    });

    if (quizQuestionsToInsert.length > 0) {
      const { error: quizError } = await supabase
        .from('quiz_questions')
        .insert(quizQuestionsToInsert);

      if (quizError) {
        console.error('Error inserting quiz questions:', quizError);
        return;
      }

      console.log(`✓ Inserted ${quizQuestionsToInsert.length} quiz questions`);
    }

    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
