import { useEffect, useState } from 'react';
import { Category } from '../lib/api';
import { BookOpen, Clock, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import BiologyHero from './BiologyHero';

interface HomePageProps extends NavigationProps {}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
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
    setLoading(false);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Use hardcoded categories instead of API data
      setCategories(hardcodedCategories);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to hardcoded categories even if API fails
      setCategories(hardcodedCategories);
    } finally {
      setLoading(false);
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
      {/* Biology Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <BiologyHero 
          onGetStarted={() => onNavigate('tracks')}
          onHaveAccount={() => onNavigate('login')}
        />
        
        {/* Decorative Line Separator */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Number */}
                <div className="relative mb-2">
                  <div className="text-5xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    100+
                  </div>
                </div>
                
                {/* Label */}
                <div className="relative">
                  <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Learning Tracks
                  </div>
                </div>
              </div>
            </div>

            <div className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Number */}
                <div className="relative mb-2">
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    500+
                  </div>
                </div>
                
                {/* Label */}
                <div className="relative">
                  <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Lessons
                  </div>
                </div>
              </div>
            </div>

            <div className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Number */}
                <div className="relative mb-2">
                  <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    10K+
                  </div>
                </div>
                
                {/* Label */}
                <div className="relative">
                  <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Students
                  </div>
                </div>
              </div>
            </div>

            <div className="group text-center">
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Number */}
                <div className="relative mb-2">
                  <div className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    4.9★
                  </div>
                </div>
                
                {/* Label */}
                <div className="relative">
                  <div className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full text-teal-700 font-semibold text-sm mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
              Why Choose BiologyHub
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600">Modern Learners</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience biology education reimagined with cutting-edge technology, personalized learning paths, and a community that supports your journey.
            </p>
          </div>
          
          {/* Features Grid - Different Layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Column - 2 Features */}
            <div className="space-y-8">
              <div className="group relative">
                <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-teal-500 hover:border-teal-600">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Community Support
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Connect with fellow biology enthusiasts, share knowledge, and get help from a supportive learning community that grows with you.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-cyan-500 hover:border-cyan-600">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                      Self-Paced Learning
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Learn at your own speed with flexible scheduling that adapts to your lifestyle, commitments, and learning preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - 2 Features */}
            <div className="space-y-8">
              <div className="group relative">
                <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-emerald-500 hover:border-emerald-600">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      AI-Powered Insights
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Smart progress tracking with personalized recommendations and adaptive learning paths that evolve with your understanding.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-amber-500 hover:border-amber-600">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                      Interactive Experience
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Engaging quizzes, 3D models, and hands-on simulations that bring biology concepts to life in ways you've never experienced.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span className="text-white font-bold text-lg">Ready to Start Learning?</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Categories Section */}
      <section className="relative py-24 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/30 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full text-teal-700 font-semibold text-sm mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
              Discover Your Path
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Journey through specialized areas of biology with our comprehensive category-based learning paths designed for every level.
            </p>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onNavigate('category', category)}
                className="group relative"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Card Container */}
                <div className="relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 border border-gray-100/50">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative text-center">
                    {/* Icon Container */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </span>
                      </div>
                      {/* Glow Effect */}
                      <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {category.description}
                    </p>
                    
                    {/* Explore Button */}
                    <div className="inline-flex items-center px-4 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-full text-teal-700 text-sm font-medium transition-all duration-300 group-hover:translate-y-1">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Corner Accent */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Floating Particles Effect */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-teal-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" style={{animationDelay: '0.5s'}}></div>
              </button>
            ))}
          </div>
          
          {/* Bottom Decoration */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 text-teal-600 text-sm">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span>Choose your learning adventure</span>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
