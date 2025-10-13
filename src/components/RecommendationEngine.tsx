import { useEffect, useState } from 'react';
import { TrendingUp, BookOpen, Brain, Zap, ArrowRight, Star, Clock, Target } from 'lucide-react';
import { aiSearchService, Recommendation } from '../lib/aiSearch';
import { NavigationProps } from '../types/navigation';

interface RecommendationEngineProps extends NavigationProps {
  completedItemId?: string;
  completedItemType?: 'track' | 'lesson' | 'glossary' | 'news';
  title?: string;
  showTitle?: boolean;
  maxRecommendations?: number;
}

export default function RecommendationEngine({
  onNavigate,
  completedItemId,
  completedItemType = 'track',
  title = "Recommended for You",
  showTitle = true,
  maxRecommendations = 6
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [completedItemId, completedItemType]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use provided item or default to a completed track
      const itemId = completedItemId || 'track-1'; // Default to DNA Structure & Function
      const itemType = completedItemType || 'track';
      
      const recs = await aiSearchService.getRecommendations(itemId, itemType, maxRecommendations);
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    // Navigate based on recommendation type
    switch (recommendation.type) {
      case 'track':
        onNavigate('track', { id: recommendation.id });
        break;
      case 'lesson':
        onNavigate('lesson', { id: recommendation.id });
        break;
      case 'glossary':
        onNavigate('glossary');
        break;
      case 'news':
        onNavigate('news');
        break;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'track': return <BookOpen className="w-5 h-5" />;
      case 'lesson': return <Brain className="w-5 h-5" />;
      case 'glossary': return <Target className="w-5 h-5" />;
      case 'news': return <TrendingUp className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'track': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'lesson': return 'bg-green-100 text-green-700 border-green-200';
      case 'glossary': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'news': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {showTitle && (
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: maxRecommendations }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {showTitle && (
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <Zap className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRecommendations}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {showTitle && (
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Brain className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">No recommendations available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="text-sm text-gray-500">
            Powered by AI
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id}
            onClick={() => handleRecommendationClick(recommendation)}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(recommendation.type)}`}>
                    {getTypeIcon(recommendation.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{recommendation.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {recommendation.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                      {recommendation.difficulty}
                    </span>
                  )}
                  <div className="flex items-center">
                    <Star className={`w-4 h-4 ${getConfidenceColor(recommendation.confidence)}`} />
                    <span className={`text-xs ml-1 ${getConfidenceColor(recommendation.confidence)}`}>
                      {Math.round(recommendation.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {recommendation.reason}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>AI Recommended</span>
                </div>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
                  <span className="text-sm font-medium mr-1">Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Category Badge */}
              {recommendation.category && (
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {recommendation.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {recommendations.length >= maxRecommendations && (
        <div className="mt-6 text-center">
          <button
            onClick={loadRecommendations}
            className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
          >
            Show More Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
