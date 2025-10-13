import { useEffect, useState } from 'react';
import { supabase, Lesson, Track, QuizQuestion } from '../lib/supabase';
import { Clock, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  track: Track;
  onNavigate: (view: string, data?: any) => void;
}

export default function LessonViewer({ lesson, track, onNavigate }: LessonViewerProps) {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonData();
  }, [lesson.id]);

  const loadLessonData = async () => {
    const userId = localStorage.getItem('userId') || generateUserId();

    const [lessonsRes, quizRes, progressRes] = await Promise.all([
      supabase.from('lessons').select('*').eq('track_id', track.id).order('order_index'),
      supabase.from('quiz_questions').select('*').eq('lesson_id', lesson.id).order('order_index'),
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lesson.id)
        .maybeSingle(),
    ]);

    if (lessonsRes.data) setAllLessons(lessonsRes.data);
    if (quizRes.data) setQuizQuestions(quizRes.data);
    if (progressRes.data) setIsCompleted(progressRes.data.completed);
    setLoading(false);
  };

  const generateUserId = () => {
    const id = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', id);
    return id;
  };

  const markAsComplete = async () => {
    const userId = localStorage.getItem('userId') || generateUserId();

    await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        track_id: track.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

    setIsCompleted(true);
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    const correctCount = quizQuestions.filter(
      (q) => quizAnswers[q.id] === q.correct_answer
    ).length;
    const score = Math.round((correctCount / quizQuestions.length) * 100);

    const userId = localStorage.getItem('userId') || generateUserId();

    await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        track_id: track.id,
        lesson_id: lesson.id,
        completed: true,
        score: score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

    setIsCompleted(true);
  };

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => onNavigate('track', track)}
          className="text-teal-600 hover:text-teal-700 font-semibold mb-6 flex items-center"
        >
          ← Back to Track
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-semibold">{track.title}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 capitalize">
                <span>📚</span>
                <span>{lesson.content_type}</span>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none mb-8">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>

            {quizQuestions.length > 0 && !showQuiz && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Test Your Knowledge</h3>
                <p className="text-gray-600 mb-4">
                  Complete the quiz to reinforce what you've learned.
                </p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {showQuiz && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quiz</h3>
                <div className="space-y-6">
                  {quizQuestions.map((question, qIndex) => (
                    <div key={question.id} className="bg-white rounded-lg p-6 shadow-sm">
                      <p className="font-semibold text-gray-800 mb-4">
                        {qIndex + 1}. {question.question_text}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option) => {
                          const isSelected = quizAnswers[question.id] === option.id;
                          const isCorrect = option.id === question.correct_answer;
                          const showResult = quizSubmitted;

                          let bgColor = 'bg-white hover:bg-gray-50';
                          if (showResult && isCorrect) bgColor = 'bg-green-100 border-green-300';
                          else if (showResult && isSelected && !isCorrect)
                            bgColor = 'bg-red-100 border-red-300';
                          else if (isSelected) bgColor = 'bg-teal-50 border-teal-300';

                          return (
                            <button
                              key={option.id}
                              onClick={() =>
                                !quizSubmitted &&
                                setQuizAnswers({ ...quizAnswers, [question.id]: option.id })
                              }
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgColor} ${
                                quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                              }`}
                            >
                              {option.text}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Explanation:</span> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted && (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                    className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                )}

                {quizSubmitted && (
                  <div className="mt-6 p-6 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Quiz Complete!</h4>
                    <p className="text-gray-700">
                      You got{' '}
                      {quizQuestions.filter((q) => quizAnswers[q.id] === q.correct_answer).length}{' '}
                      out of {quizQuestions.length} correct.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isCompleted && quizQuestions.length === 0 && (
              <button
                onClick={markAsComplete}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => prevLesson && onNavigate('lesson', { lesson: prevLesson, track })}
              disabled={!prevLesson}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-teal-600 hover:bg-teal-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Lesson
            </button>
            <button
              onClick={() => nextLesson && onNavigate('lesson', { lesson: nextLesson, track })}
              disabled={!nextLesson}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-teal-600 hover:bg-teal-50"
            >
              Next Lesson
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
