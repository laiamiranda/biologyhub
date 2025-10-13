import { useEffect, useState } from 'react';
import { Category, Track, getCategories, getTracks } from '../lib/api';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import RecommendationEngine from './RecommendationEngine';

interface HomePageProps extends NavigationProps {}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, tracksData] = await Promise.all([
        getCategories(),
        getTracks(),
      ]);

      setCategories(categoriesData);
      setFeaturedTracks(tracksData.slice(0, 6)); // Get first 6 tracks
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Master Biology from Basics to Advanced
            </h1>
            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
              100 comprehensive learning tracks covering every aspect of biology.
              Interactive lessons, quizzes, and real-world applications.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('tracks')}
                className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore All Tracks
              </button>
              <button
                onClick={() => onNavigate('quizzes')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Take Quizzes
              </button>
              <button
                onClick={() => onNavigate('news')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Bio News
              </button>
              <button
                onClick={() => onNavigate('glossary')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Glossary
              </button>
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">100 Tracks</h3>
            <p className="text-gray-600">Comprehensive courses from cell biology to biotechnology</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Self-Paced</h3>
            <p className="text-gray-600">Learn at your own speed with flexible scheduling</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and achievements</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with interactive assessments</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('category', category)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Tracks</h2>
            <button
              onClick={() => onNavigate('tracks')}
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => onNavigate('track', track)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
              >
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-teal-600">
                      Track {track.track_number}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                        track.difficulty_level
                      )}`}
                    >
                      {track.difficulty_level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{track.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{track.estimated_hours} hours</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-16">
          <RecommendationEngine
            onNavigate={onNavigate}
            completedItemId="track-1"
            completedItemType="track"
            title="Recommended for You"
            showTitle={true}
            maxRecommendations={6}
          />
        </div>
      </section>
    </div>
  );
}
