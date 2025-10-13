import { useEffect, useState } from 'react';
import { Track, Category, getTracks, getCategories, getQuizQuestions, getUserProgress } from '../lib/api';
import { Brain, BookOpen, Clock, Target, Zap, RotateCcw, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuizPageProps {
  onNavigate: (view: string, data?: any) => void;
}

interface Quiz {
  id: string;
  track_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question_count: number;
  estimated_minutes: number;
  unlocked: boolean;
}

interface Flashcard {
  id: string;
  track_id: string;
  front: string;
  back: string;
  category: 'vocabulary' | 'process' | 'diagram';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizSession {
  quiz: Quiz;
  questions: any[];
  currentQuestion: number;
  answers: { [questionId: string]: string };
  score: number;
  completed: boolean;
  timeSpent: number;
}

export default function QuizPage({ onNavigate }: QuizPageProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [view, setView] = useState<'overview' | 'quiz' | 'flashcards'>('overview');
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tracksData, categoriesData, progressData] = await Promise.all([
        getTracks(),
        getCategories(),
        getUserProgress('temp-user'),
      ]);

      setTracks(tracksData);
      setCategories(categoriesData);
      setUserProgress(progressData);

      // Generate mock quizzes and flashcards based on tracks
      const mockQuizzes = generateMockQuizzes(tracksData, progressData);
      const mockFlashcards = generateMockFlashcards(tracksData);
      
      setQuizzes(mockQuizzes);
      setFlashcards(mockFlashcards);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuizzes = (tracks: Track[], progress: any[]): Quiz[] => {
    return tracks.map((track, index) => {
      const trackProgress = progress.filter(p => p.track_id === track.id && p.completed);
      const completedLessons = trackProgress.length;
      const totalLessons = 5; // Mock total lessons per track
      
      return {
        id: `quiz-${track.id}`,
        track_id: track.id,
        title: `${track.title} - Quiz`,
        description: `Test your knowledge of ${track.title.toLowerCase()}`,
        difficulty: track.difficulty_level,
        question_count: 10,
        estimated_minutes: 15,
        unlocked: completedLessons >= 2 || track.difficulty_level === 'beginner',
      };
    });
  };

  const generateMockFlashcards = (tracks: Track[]): Flashcard[] => {
    const flashcardSets = [
      // Foundations of Biology flashcards
      { front: 'What is the basic unit of life?', back: 'Cell', category: 'vocabulary' as const },
      { front: 'What does DNA stand for?', back: 'Deoxyribonucleic Acid', category: 'vocabulary' as const },
      { front: 'What is the powerhouse of the cell?', back: 'Mitochondria', category: 'vocabulary' as const },
      { front: 'What is the process by which plants make food?', back: 'Photosynthesis', category: 'process' as const },
      { front: 'What are the three parts of the cell theory?', back: '1. All living things are made of cells 2. Cells are the basic unit of life 3. All cells come from pre-existing cells', category: 'process' as const },
      
      // Genetics flashcards
      { front: 'What is a gene?', back: 'A segment of DNA that codes for a specific protein', category: 'vocabulary' as const },
      { front: 'What is the difference between genotype and phenotype?', back: 'Genotype is the genetic makeup, phenotype is the physical expression', category: 'vocabulary' as const },
      { front: 'What is the process of DNA replication?', back: 'DNA unwinds, complementary bases pair up, two identical DNA molecules are formed', category: 'process' as const },
      
      // Human Anatomy flashcards
      { front: 'What is the largest organ in the human body?', back: 'Skin', category: 'vocabulary' as const },
      { front: 'What are the four chambers of the heart?', back: 'Right atrium, right ventricle, left atrium, left ventricle', category: 'diagram' as const },
      { front: 'What is the function of red blood cells?', back: 'Transport oxygen from lungs to body tissues', category: 'process' as const },
    ];

    return tracks.slice(0, 20).flatMap((track, trackIndex) => 
      flashcardSets.slice(0, 3).map((card, cardIndex) => ({
        id: `flashcard-${track.id}-${cardIndex}`,
        track_id: track.id,
        front: card.front,
        back: card.back,
        category: card.category,
        difficulty: track.difficulty_level,
      }))
    );
  };

  const startQuiz = async (quiz: Quiz) => {
    try {
      const questions = await getQuizQuestions(quiz.track_id);
      setQuizSession({
        quiz,
        questions: questions.length > 0 ? questions : generateMockQuestions(quiz),
        currentQuestion: 0,
        answers: {},
        score: 0,
        completed: false,
        timeSpent: 0,
      });
      setView('quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const generateMockQuestions = (quiz: Quiz) => {
    return Array.from({ length: quiz.question_count }, (_, i) => ({
      id: `q-${i + 1}`,
      question_text: `Sample question ${i + 1} for ${quiz.title}?`,
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ],
      correct_answer: 'a',
      explanation: `This is the explanation for question ${i + 1}`,
    }));
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    if (!quizSession) return;

    const newAnswers = { ...quizSession.answers, [questionId]: answer };
    setQuizSession({ ...quizSession, answers: newAnswers });
  };

  const nextQuestion = () => {
    if (!quizSession) return;
    
    if (quizSession.currentQuestion < quizSession.questions.length - 1) {
      setQuizSession({ ...quizSession, currentQuestion: quizSession.currentQuestion + 1 });
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (!quizSession) return;
    
    if (quizSession.currentQuestion > 0) {
      setQuizSession({ ...quizSession, currentQuestion: quizSession.currentQuestion - 1 });
    }
  };

  const finishQuiz = () => {
    if (!quizSession) return;

    const correctAnswers = quizSession.questions.filter(
      q => quizSession.answers[q.id] === q.correct_answer
    ).length;
    
    const score = Math.round((correctAnswers / quizSession.questions.length) * 100);
    
    setQuizSession({
      ...quizSession,
      score,
      completed: true,
    });
  };

  const resetQuiz = () => {
    if (!quizSession) return;
    
    setQuizSession({
      ...quizSession,
      currentQuestion: 0,
      answers: {},
      score: 0,
      completed: false,
    });
  };

  const startFlashcards = (track: Track) => {
    setSelectedTrack(track);
    setCurrentFlashcard(0);
    setShowAnswer(false);
    setView('flashcards');
  };

  const nextFlashcard = () => {
    const trackFlashcards = flashcards.filter(f => f.track_id === selectedTrack?.id);
    if (currentFlashcard < trackFlashcards.length - 1) {
      setCurrentFlashcard(currentFlashcard + 1);
      setShowAnswer(false);
    }
  };

  const previousFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(currentFlashcard - 1);
      setShowAnswer(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vocabulary': return 'bg-blue-100 text-blue-700';
      case 'process': return 'bg-purple-100 text-purple-700';
      case 'diagram': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (view === 'quiz' && quizSession) {
    const currentQ = quizSession.questions[quizSession.currentQuestion];
    const progress = ((quizSession.currentQuestion + 1) / quizSession.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('overview')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </button>
              <div className="text-sm text-gray-500">
                Question {quizSession.currentQuestion + 1} of {quizSession.questions.length}
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{quizSession.quiz.title}</h2>
            </div>

            {!quizSession.completed ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question_text}</h3>
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleQuizAnswer(currentQ.id, option.id)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        quizSession.answers[currentQ.id] === option.id
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                      }`}
                    >
                      <span className="font-medium mr-3">{option.id.toUpperCase()}.</span>
                      {option.text}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={previousQuestion}
                    disabled={quizSession.currentQuestion === 0}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    {quizSession.currentQuestion === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-teal-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                  <p className="text-xl text-teal-600 font-semibold">Score: {quizSession.score}%</p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setView('overview')}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
                  >
                    Back to Quizzes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'flashcards' && selectedTrack) {
    const trackFlashcards = flashcards.filter(f => f.track_id === selectedTrack.id);
    const currentCard = trackFlashcards[currentFlashcard];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('overview')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Flashcards
              </button>
              <div className="text-sm text-gray-500">
                Card {currentFlashcard + 1} of {trackFlashcards.length}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedTrack.title} - Flashcards</h2>

            {currentCard && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentCard.category)}`}>
                    {currentCard.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentCard.difficulty)}`}>
                    {currentCard.difficulty}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      {showAnswer ? 'Answer' : 'Question'}
                    </h3>
                    <p className="text-xl">
                      {showAnswer ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                  >
                    {showAnswer ? 'Show Question' : 'Show Answer'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={previousFlashcard}
                disabled={currentFlashcard === 0}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={nextFlashcard}
                disabled={currentFlashcard === trackFlashcards.length - 1}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Interactive Quizzes & Flashcards</h1>
            <p className="text-xl text-teal-100 mb-8">
              Test your knowledge with self-assessment quizzes and master key concepts with flashcards.
              Progress-based difficulty unlock keeps you challenged!
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Self-Assessment Quizzes</h3>
            <p className="text-gray-600">Test your understanding with track-specific quizzes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Flashcards</h3>
            <p className="text-gray-600">Master vocabulary, processes, and diagrams</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Unlock</h3>
            <p className="text-gray-600">Unlock advanced content as you progress</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedCategory?.id === category.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Quizzes</h3>
              <span className="text-sm text-gray-500">
                {quizzes.filter(q => q.unlocked).length} unlocked
              </span>
            </div>
            <div className="space-y-4">
              {quizzes
                .filter(q => !selectedCategory || tracks.find(t => t.id === q.track_id)?.category_id === selectedCategory.id)
                .slice(0, 10)
                .map((quiz) => {
                  const track = tracks.find(t => t.id === quiz.track_id);
                  return (
                    <div
                      key={quiz.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        quiz.unlocked
                          ? 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => quiz.unlocked && startQuiz(quiz)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`}>
                            {quiz.difficulty}
                          </span>
                          {!quiz.unlocked && <Target className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{quiz.estimated_minutes} min • {quiz.question_count} questions</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Flashcards</h3>
              <span className="text-sm text-gray-500">
                {flashcards.length} cards available
              </span>
            </div>
            <div className="space-y-4">
              {tracks
                .filter(t => !selectedCategory || t.category_id === selectedCategory.id)
                .slice(0, 10)
                .map((track) => {
                  const trackFlashcards = flashcards.filter(f => f.track_id === track.id);
                  return (
                    <div
                      key={track.id}
                      onClick={() => startFlashcards(track)}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{track.title}</h4>
                        <span className="text-sm text-gray-500">{trackFlashcards.length} cards</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Vocabulary, processes, and diagrams</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="w-3 h-3 mr-1" />
                        <span>Interactive learning</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
