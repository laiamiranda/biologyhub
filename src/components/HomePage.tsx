import { useEffect, useState } from 'react';
import { Category, Track, getTracks } from '../lib/api';
import { BookOpen, Clock, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import RecommendationEngine from './RecommendationEngine';

interface HomePageProps extends NavigationProps {}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded categories to match glossary exactly
  const hardcodedCategories: Category[] = [
    {
      id: 'foundations-biology',
      name: 'Foundations of Biology',
      description: 'Core concepts from cell theory to energy systems',
      icon: '🧬',
      order_index: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 'genetics-molecular',
      name: 'Genetics & Molecular Biology',
      description: 'DNA, inheritance, and genetic engineering',
      icon: '🧪',
      order_index: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'human-anatomy-physiology',
      name: 'Human Anatomy & Physiology',
      description: 'Body systems and their functions',
      icon: '🧠',
      order_index: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 'microbiology-virology',
      name: 'Microbiology & Virology',
      description: 'Bacteria, viruses, and microorganisms',
      icon: '🧫',
      order_index: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: 'immunology-host-defense',
      name: 'Immunology & Host Defense',
      description: 'Immune system and disease protection',
      icon: '🛡️',
      order_index: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'plant-biology-ecology',
      name: 'Plant Biology & Ecology',
      description: 'Plant systems and environmental science',
      icon: '🌱',
      order_index: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: 'biochemistry-metabolism',
      name: 'Biochemistry & Metabolism',
      description: 'Molecular processes and energy pathways',
      icon: '⚗️',
      order_index: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: 'developmental-evolutionary',
      name: 'Developmental & Evolutionary Biology',
      description: 'Growth, development, and evolution',
      icon: '🦕',
      order_index: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: 'biotechnology-modern',
      name: 'Biotechnology & Modern Biology',
      description: 'Genetic engineering and applied biology',
      icon: '🔬',
      order_index: 9,
      created_at: new Date().toISOString(),
    },
    {
      id: 'special-topics',
      name: 'Special Topics & Applications',
      description: 'Advanced topics and real-world applications',
      icon: '🧭',
      order_index: 10,
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const tracksData = await getTracks();

      // Use hardcoded categories instead of API data
      setCategories(hardcodedCategories);
      setFeaturedTracks(tracksData.slice(0, 6)); // Get first 6 tracks
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to hardcoded categories even if API fails
      setCategories(hardcodedCategories);
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
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-teal-100 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Live Learning Platform
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Master Biology
              <span className="block text-4xl lg:text-5xl text-teal-100 font-light mt-2">
                from Basics to Advanced
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-teal-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Dive into <span className="font-semibold text-white">100+ comprehensive tracks</span> covering every aspect of biology. 
              Interactive lessons, AI-powered quizzes, and real-world applications await.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => onNavigate('tracks')}
                className="group px-8 py-4 bg-white text-teal-700 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all duration-300 shadow-2xl hover:shadow-teal-500/25 transform hover:-translate-y-1 flex items-center"
              >
                <BookOpen className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Explore All Tracks
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-teal-200 text-sm">Learning Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-teal-200 text-sm">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-teal-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                <div className="text-teal-200 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">BiologyHub</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of biology education with cutting-edge features designed for modern learners.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">100+ Tracks</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive courses from cell biology to biotechnology, covering every aspect of life sciences.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Self-Paced</h3>
              <p className="text-gray-600 leading-relaxed">Learn at your own speed with flexible scheduling that fits your lifestyle and commitments.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">Smart progress tracking with personalized recommendations and adaptive learning paths.</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interactive</h3>
              <p className="text-gray-600 leading-relaxed">Engaging quizzes, 3D models, and hands-on simulations that bring biology to life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deep into specialized areas of biology with our comprehensive category-based learning paths.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onNavigate('category', category)}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left border border-gray-100 hover:border-teal-200"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-teal-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Explore →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Featured Tracks Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Tracks</span>
              </h2>
              <p className="text-xl text-gray-600">Hand-picked learning paths to get you started on your biology journey.</p>
            </div>
            <button
              onClick={() => onNavigate('tracks')}
              className="group px-6 py-3 bg-teal-600 text-white rounded-2xl font-semibold hover:bg-teal-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-teal-500/25"
            >
              View All Tracks
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => onNavigate('track', track)}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 h-1"></div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-teal-100 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5 text-teal-600" />
                      </div>
                      <span className="text-sm font-bold text-teal-600">
                        Track {track.track_number}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-4 py-2 rounded-full font-semibold ${getDifficultyColor(
                        track.difficulty_level
                      )}`}
                    >
                      {track.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                    {track.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {track.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-5 h-5 mr-2 text-teal-500" />
                      <span className="font-medium">{track.estimated_hours} hours</span>
                    </div>
                    <div className="text-teal-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Start Learning →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
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
