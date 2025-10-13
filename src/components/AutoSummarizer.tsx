import { useState, useEffect } from 'react';
import { FileText, Clock, Target, BookOpen, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { aiSummarizer, LessonSummary, DetailedSummary } from '../lib/aiSummarizer';
import { NavigationProps } from '../types/navigation';

interface AutoSummarizerProps extends NavigationProps {
  lessonContent: string;
  lessonTitle: string;
  lessonId: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onClose?: () => void;
}

export default function AutoSummarizer({
  onNavigate,
  lessonContent,
  lessonTitle,
  lessonId,
  difficulty = 'intermediate',
  onClose
}: AutoSummarizerProps) {
  const [summary, setSummary] = useState<LessonSummary | null>(null);
  const [detailedSummary, setDetailedSummary] = useState<DetailedSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'detailed'>('overview');
  const [showStudyNotes, setShowStudyNotes] = useState(false);
  const [studyNotes, setStudyNotes] = useState<any>(null);

  useEffect(() => {
    generateSummary();
  }, [lessonContent, lessonTitle, lessonId, difficulty]);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    setDetailedSummary(null);

    try {
      const basicSummary = await aiSummarizer.generateSummary(
        lessonContent,
        lessonTitle,
        lessonId,
        difficulty
      );
      setSummary(basicSummary);

      // Generate detailed summary in background
      const detailed = await aiSummarizer.generateDetailedSummary(
        lessonContent,
        lessonTitle,
        lessonId
      );
      setDetailedSummary(detailed);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateStudyNotes = async () => {
    if (studyNotes) return;

    try {
      const notes = await aiSummarizer.generateStudyNotes(lessonContent, lessonTitle);
      setStudyNotes(notes);
      setShowStudyNotes(true);
    } catch (err) {
      console.error('Failed to generate study notes:', err);
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating AI Summary</h3>
                <p className="text-gray-600">AI is analyzing the lesson content...</p>
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
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Summary Generation Failed</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={generateSummary}
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

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Summary Available</h3>
              <p className="text-gray-600">Unable to generate summary at this time.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">AI Lesson Summary</h1>
                <p className="text-gray-600">{lessonTitle}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(summary.difficulty)}`}>
              {summary.difficulty}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{summary.estimatedReadTime} min read</span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${getConfidenceColor(summary.confidence)}`}>
                {Math.round(summary.confidence * 100)}% confidence
              </span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setView('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'overview'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Overview
            </button>
            <button
              onClick={() => setView('detailed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'detailed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detailed Analysis
            </button>
          </div>
        </div>

        {/* Quick Overview */}
        {view === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* TL;DR */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">TL;DR</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{summary.tldr}</p>
            </div>

            {/* Key Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Key Takeaways</h3>
                </div>
                <ul className="space-y-2">
                  {summary.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Important Concepts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {summary.importantConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        {view === 'detailed' && detailedSummary && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Lesson Overview</h2>
              <p className="text-gray-700 leading-relaxed">{detailedSummary.overview}</p>
            </div>

            {/* Main Topics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Main Topics</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {detailedSummary.mainTopics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{topic.topic}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        topic.importance === 'high' ? 'bg-red-100 text-red-700' :
                        topic.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {topic.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Terms */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Key Terms</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {detailedSummary.keyTerms.map((term, index) => (
                  <div key={index} className="border-l-4 border-teal-500 pl-4">
                    <h3 className="font-semibold text-gray-800">{term.term}</h3>
                    <p className="text-sm text-gray-600 mb-1">{term.definition}</p>
                    <p className="text-xs text-gray-500 italic">{term.context}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Objectives</h2>
              <ul className="space-y-2">
                {detailedSummary.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites & Next Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {detailedSummary.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <BookOpen className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h2>
                <ul className="space-y-2">
                  {detailedSummary.nextSteps.map((step, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <Target className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Study Notes */}
        {showStudyNotes && studyNotes && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Study Notes</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">{studyNotes.notes}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Review Questions</h3>
                  <ul className="space-y-1">
                    {studyNotes.questions.map((question: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">• {question}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Practice Suggestions</h3>
                  <ul className="space-y-1">
                    {studyNotes.practiceSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={generateStudyNotes}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Generate Study Notes
          </button>
          <button
            onClick={generateSummary}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate Summary
          </button>
        </div>
      </div>
    </div>
  );
}
