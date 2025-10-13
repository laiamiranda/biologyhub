import { useEffect, useState } from 'react';
import { Track, Lesson, Category, getLessons, getCategories, getUserProgress } from '../lib/api';
import { Clock, BookOpen, Play, CheckCircle, Circle } from 'lucide-react';
import RecommendationEngine from './RecommendationEngine';

interface TrackDetailProps {
  track: Track;
  onNavigate: (view: string, data?: any) => void;
}

export default function TrackDetail({ track, onNavigate }: TrackDetailProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [progress, setProgress] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackDetails();
  }, [track.id]);

  const loadTrackDetails = async () => {
    try {
      const [lessonsData, categoriesData, progressData] = await Promise.all([
        getLessons(track.id),
        getCategories().then(cats => cats.find(cat => cat.id === track.category_id) || null),
        getUserProgress('temp-user'), // For now, use a temp user ID
      ]);

      setLessons(lessonsData);
      setCategory(categoriesData);
      if (progressData) {
        setProgress(new Set(progressData.map((p) => p.lesson_id)));
      }
    } catch (error) {
      console.error('Failed to load track details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'interactive':
        return '🧪';
      case 'quiz':
        return '📝';
      default:
        return '📚';
    }
  };

  const completionRate =
    lessons.length > 0 ? Math.round((progress.size / lessons.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => onNavigate('tracks')}
          className="text-teal-600 hover:text-teal-700 font-semibold mb-6 flex items-center"
        >
          ← Back to Tracks
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              {category && <span className="text-3xl">{category.icon}</span>}
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Track {track.track_number}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium border bg-white ${getDifficultyColor(
                  track.difficulty_level
                )}`}
              >
                {track.difficulty_level}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{track.title}</h1>
            <p className="text-teal-100 text-lg mb-6">{track.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{track.estimated_hours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{completionRate}% complete</span>
              </div>
            </div>
          </div>

          {completionRate > 0 && (
            <div className="px-8 py-4 bg-teal-50 border-b border-teal-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                <span className="text-sm font-bold text-teal-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h2>
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = progress.has(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onNavigate('lesson', { lesson, track })}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer group"
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-teal-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 group-hover:text-teal-400" />
                      )}
                    </div>
                    <div className="flex-shrink-0 text-2xl">
                      {getContentTypeIcon(lesson.content_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">
                          Lesson {index + 1}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">
                          {lesson.content_type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors truncate">
                        {lesson.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration_minutes} min</span>
                    </div>
                    <div className="flex-shrink-0">
                      <Play className="w-5 h-5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-12">
          <RecommendationEngine
            onNavigate={onNavigate}
            completedItemId={track.id}
            completedItemType="track"
            title="Continue Your Learning Journey"
            showTitle={true}
            maxRecommendations={4}
          />
        </div>
      </div>
    </div>
  );
}
