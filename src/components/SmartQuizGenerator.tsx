import { useState, useEffect } from 'react';
import { Brain, Zap, Clock, Target, CheckCircle, XCircle, RotateCcw, Play, Sparkles } from 'lucide-react';
import { aiQuizGenerator, QuizGenerationRequest, GeneratedQuiz, QuizQuestion } from '../lib/aiQuizGenerator';
import { NavigationProps } from '../types/navigation';

interface SmartQuizGeneratorProps extends NavigationProps {
  lessonContent: string;
  lessonTitle: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onClose?: () => void;
}

export default function SmartQuizGenerator({
  onNavigate,
  lessonContent,
  lessonTitle,
  topic,
  difficulty = 'medium',
  onClose
}: SmartQuizGeneratorProps) {
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>(difficulty);

  useEffect(() => {
    generateQuiz();
  }, [lessonContent, lessonTitle, topic, selectedDifficulty, questionCount]);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);

    try {
      const request: QuizGenerationRequest = {
        lessonContent,
        lessonTitle,
        topic,
        difficulty: selectedDifficulty,
        questionCount,
        questionTypes: ['multiple_choice', 'true_false', 'fill_blank']
      };

      const generatedQuiz = await aiQuizGenerator.generateQuiz(request);
      setQuiz(generatedQuiz);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (!quiz) return;
    setQuizStarted(true);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const selectAnswer = (answerIndex: number) => {
    if (!quiz || showResults) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = async () => {
    if (!quiz) return;
    
    try {
      const analysis = await aiQuizGenerator.analyzeQuizPerformance(quiz, userAnswers);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to analyze quiz performance:', err);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Smart Quiz</h3>
                <p className="text-gray-600">AI is creating personalized questions for you...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quiz Generation Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={generateQuiz}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quiz Available</h3>
              <p className="text-gray-600">Unable to generate quiz at this time.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Smart Quiz Generator</h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{quiz.title}</h2>
              <p className="text-gray-600 mb-6">{quiz.description}</p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="font-semibold text-teal-800">Questions</span>
                  </div>
                  <p className="text-2xl font-bold text-teal-600">{quiz.totalQuestions}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Time</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{quiz.estimatedTime} min</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-800">Difficulty</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 capitalize">{quiz.difficulty}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 mr-2" />
                  <h3 className="text-xl font-semibold">AI-Generated Questions</h3>
                </div>
                <p className="text-teal-100">
                  This quiz was created by AI based on your lesson content. Each question is designed to test your understanding and help you learn more effectively.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startQuiz}
                className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <CheckCircle className={`w-12 h-12 ${
                  percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                {percentage}%
              </p>
              <p className="text-gray-600">
                You got {correctAnswers} out of {quiz.questions.length} questions correct
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  <li className="text-green-700">• Good understanding of core concepts</li>
                  <li className="text-green-700">• Strong grasp of key principles</li>
                  <li className="text-green-700">• Effective problem-solving skills</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">Areas to Improve</h3>
                <ul className="space-y-2">
                  <li className="text-yellow-700">• Review specific concepts</li>
                  <li className="text-yellow-700">• Practice more examples</li>
                  <li className="text-yellow-700">• Focus on weak areas</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </button>
              <button
                onClick={generateQuiz}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentQ.difficulty)}`}>
                {currentQ.difficulty}
              </span>
              <span className="text-sm text-gray-500">{currentQ.topic}</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>
            
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    userAnswers[currentQuestion] === index
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
