import { useEffect, useState } from 'react';
import { Lesson, Track, QuizQuestion, getQuizQuestions, updateUserProgress } from '../lib/api';
import { Clock, BookOpen, ChevronLeft, ChevronRight, CheckCircle, Brain, FileText, MessageCircle, Zap } from 'lucide-react';
import SmartQuizGenerator from './SmartQuizGenerator';
import AITutorMode from './AITutorMode';
import AutoSummarizer from './AutoSummarizer';

import { NavigationProps } from '../types/navigation';

interface LessonViewerProps extends NavigationProps {
  lesson: Lesson;
  track: Track;
}

export default function LessonViewer({ lesson, track, onNavigate }: LessonViewerProps) {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [activeAIFeature, setActiveAIFeature] = useState<'quiz' | 'tutor' | 'summary' | null>(null);

  useEffect(() => {
    loadLessonData();
  }, [lesson.id]);

  const loadLessonData = async () => {
    const userId = localStorage.getItem('userId') || generateUserId();

    try {
      const [lessonsData, quizData, progressData] = await Promise.all([
        getLessons(track.id),
        getQuizQuestions(lesson.id),
        getUserProgress(userId).then(progress => 
          progress.find(p => p.lesson_id === lesson.id) || null
        ),
      ]);

      setAllLessons(lessonsData);
      setQuizQuestions(quizData);
      if (progressData) setIsCompleted(progressData.completed);
    } catch (error) {
      console.error('Failed to load lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUserId = () => {
    const id = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', id);
    return id;
  };

  const markAsComplete = async () => {
    const userId = localStorage.getItem('userId') || generateUserId();

    try {
      await updateUserProgress({
        user_id: userId,
        track_id: track.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    const correctCount = quizQuestions.filter(
      (q) => quizAnswers[q.id] === q.correct_answer
    ).length;
    const score = Math.round((correctCount / quizQuestions.length) * 100);

    const userId = localStorage.getItem('userId') || generateUserId();

    try {
      await updateUserProgress({
        user_id: userId,
        track_id: track.id,
        lesson_id: lesson.id,
        completed: true,
        quiz_score: score,
        completed_at: new Date().toISOString(),
      });
      setIsCompleted(true);
      setQuizScore(score);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
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

            {/* AI Features Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-800">AI-Powered Learning Tools</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Enhance your learning experience with AI-powered tools designed to help you understand and master this lesson.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveAIFeature('summary')}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-800">AI Summary</span>
                  </div>
                  <p className="text-sm text-gray-600">Get a quick overview and key takeaways</p>
                </button>

                <button
                  onClick={() => setActiveAIFeature('tutor')}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-800">AI Tutor</span>
                  </div>
                  <p className="text-sm text-gray-600">Ask questions and get personalized help</p>
                </button>

                <button
                  onClick={() => setActiveAIFeature('quiz')}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center mb-2">
                    <Brain className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-gray-800">Smart Quiz</span>
                  </div>
                  <p className="text-sm text-gray-600">AI-generated questions based on this lesson</p>
                </button>
              </div>
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

        {/* AI Feature Modals */}
        {activeAIFeature === 'summary' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <AutoSummarizer
                onNavigate={onNavigate}
                lessonContent={lesson.content}
                lessonTitle={lesson.title}
                lessonId={lesson.id}
                difficulty={track.difficulty_level as 'beginner' | 'intermediate' | 'advanced'}
                onClose={() => setActiveAIFeature(null)}
              />
            </div>
          </div>
        )}

        {activeAIFeature === 'tutor' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <AITutorMode
                onNavigate={onNavigate}
                lessonContent={lesson.content}
                lessonTitle={lesson.title}
                topic={track.title}
                difficulty={track.difficulty_level as 'beginner' | 'intermediate' | 'advanced'}
                onClose={() => setActiveAIFeature(null)}
              />
            </div>
          </div>
        )}

        {activeAIFeature === 'quiz' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <SmartQuizGenerator
                onNavigate={onNavigate}
                lessonContent={lesson.content}
                lessonTitle={lesson.title}
                topic={track.title}
                difficulty={track.difficulty_level as 'easy' | 'medium' | 'hard'}
                onClose={() => setActiveAIFeature(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
