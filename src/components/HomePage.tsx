import { useEffect, useState } from 'react';
import { BookOpen, Clock, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { NavigationProps } from '../types/navigation';

interface HomePageProps extends NavigationProps {}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [loading, setLoading] = useState(true);

  // City map landmarks representing biological categories
  const cityLandmarks = [
    {
      id: 'foundations-biology',
      name: 'Foundations of Biology',
      landmark: 'Cell City Hall',
      description: 'Core concepts from cell theory to energy systems',
      icon: '🧬',
      position: { x: 16, y: 16 },
      size: 'large',
      color: 'from-blue-500 to-blue-600',
      category: 'foundations-biology'
    },
    {
      id: 'genetics-molecular',
      name: 'Genetics & Molecular Biology',
      landmark: 'Genome Vault',
      description: 'DNA, inheritance, and genetic engineering',
      icon: '🧪',
      position: { x: 83, y: 16 },
      size: 'large',
      color: 'from-purple-500 to-purple-600',
      category: 'genetics-molecular'
    },
    {
      id: 'human-anatomy-physiology',
      name: 'Human Anatomy & Physiology',
      landmark: 'Organ Tower Complex',
      description: 'Body systems and their functions',
      icon: '🧠',
      position: { x: 50, y: 50 },
      size: 'large',
      color: 'from-red-500 to-red-600',
      category: 'human-anatomy-physiology'
    },
    {
      id: 'microbiology-virology',
      name: 'Microbiology & Virology',
      landmark: 'Pathogen Outpost',
      description: 'Bacteria, viruses, and microorganisms',
      icon: '🧫',
      position: { x: 16, y: 83 },
      size: 'medium',
      color: 'from-orange-500 to-orange-600',
      category: 'microbiology-virology'
    },
    {
      id: 'immunology-host-defense',
      name: 'Immunology & Host Defense',
      landmark: 'Defense Bastion',
      description: 'Immune system and disease protection',
      icon: '🛡️',
      position: { x: 83, y: 50 },
      size: 'medium',
      color: 'from-indigo-500 to-indigo-600',
      category: 'immunology-host-defense'
    },
    {
      id: 'plant-biology-ecology',
      name: 'Plant Biology & Ecology',
      landmark: 'Photosynthesis Gardens',
      description: 'Plant systems and environmental science',
      icon: '🌱',
      position: { x: 50, y: 83 },
      size: 'large',
      color: 'from-green-500 to-green-600',
      category: 'plant-biology-ecology'
    },
    {
      id: 'biochemistry-metabolism',
      name: 'Biochemistry & Metabolism',
      landmark: 'Metabolic Core Reactor',
      description: 'Molecular processes and energy pathways',
      icon: '⚗️',
      position: { x: 50, y: 66 },
      size: 'medium',
      color: 'from-yellow-500 to-yellow-600',
      category: 'biochemistry-metabolism'
    },
    {
      id: 'developmental-evolutionary',
      name: 'Developmental & Evolutionary Biology',
      landmark: 'Embryonic Chamber',
      description: 'Growth, development, and evolution',
      icon: '🦕',
      position: { x: 50, y: 16 },
      size: 'medium',
      color: 'from-pink-500 to-pink-600',
      category: 'developmental-evolutionary'
    },
    {
      id: 'biotechnology-modern',
      name: 'Biotechnology & Modern Biology',
      landmark: 'Innovation Hub',
      description: 'Genetic engineering and applied biology',
      icon: '🔬',
      position: { x: 83, y: 83 },
      size: 'medium',
      color: 'from-cyan-500 to-cyan-600',
      category: 'biotechnology-modern'
    },
    {
      id: 'special-topics',
      name: 'Special Topics & Applications',
      landmark: 'Brain of Tomorrow',
      description: 'Advanced topics and real-world applications',
      icon: '🧭',
      position: { x: 16, y: 50 },
      size: 'large',
      color: 'from-teal-500 to-teal-600',
      category: 'special-topics'
    }
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

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

      {/* Discover Your Learning Path Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Learning Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each landmark in our biology city offers unique learning experiences. 
              Choose your starting point and begin your journey through the fascinating world of life sciences.
            </p>
        </div>

          {/* Learning Paths Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cityLandmarks.map((landmark, index) => (
              <button
                key={landmark.id}
                onClick={() => onNavigate('category', { id: landmark.category, name: landmark.name })}
                className="group bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left border border-gray-100 hover:border-teal-200"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Landmark Icon */}
                <div className={`
                  w-16 h-16 bg-gradient-to-br ${landmark.color} 
                  rounded-2xl flex items-center justify-center mb-4 
                  group-hover:scale-110 transition-transform duration-300
                  shadow-lg
                `}>
                  <span className="text-2xl">{landmark.icon}</span>
                </div>
                
                {/* Landmark Info */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                  {landmark.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {landmark.description}
                </p>
                
                {/* Explore Button */}
                <div className="flex items-center justify-end">
                  <div className="text-teal-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Explore →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Biology City Map Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Biology City</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Journey through a living city where each landmark represents a different domain of biology. 
              Click on any building to begin your exploration of that field.
            </p>
          </div>
          
          {/* Interactive Biology City Map */}
          <div className="relative bg-gradient-to-br from-sky-100 via-green-50 to-emerald-100 rounded-3xl p-8 min-h-[700px] overflow-hidden">
            <style>{`
              @keyframes pulse-glow {
                0%, 100% { 
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
                  transform: scale(1);
                }
                50% { 
                  box-shadow: 0 0 25px rgba(59, 130, 246, 0.6);
                  transform: scale(1.05);
                }
              }
              @keyframes path-flow {
                0% { stroke-dashoffset: 20; }
                100% { stroke-dashoffset: 0; }
              }
              .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
              .path-flow { animation: path-flow 3s linear infinite; }
            `}</style>
            
            {/* Category-based Background Zones */}
            <div className="absolute inset-0">
              {/* Foundations Zone (Blue) */}
              <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100/30 to-blue-200/20 rounded-3xl"></div>
              
              {/* Genetics Zone (Purple) */}
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-100/30 to-purple-200/20 rounded-3xl"></div>
              
              {/* Anatomy Zone (Red) */}
              <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-red-100/30 to-red-200/20 rounded-3xl"></div>
              
              {/* Microbiology Zone (Orange) */}
              <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-orange-100/30 to-orange-200/20 rounded-3xl"></div>
              
              {/* Immunology Zone (Indigo) */}
              <div className="absolute top-1/3 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-100/30 to-indigo-200/20 rounded-3xl"></div>
              
              {/* Ecology Zone (Green) */}
              <div className="absolute bottom-0 left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-green-100/30 to-green-200/20 rounded-3xl"></div>
              
              {/* Biochemistry Zone (Yellow) */}
              <div className="absolute top-2/3 left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-yellow-100/30 to-yellow-200/20 rounded-3xl"></div>
              
              {/* Evolution Zone (Pink) */}
              <div className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-gradient-to-br from-pink-100/30 to-pink-200/20 rounded-3xl"></div>
              
              {/* Biotechnology Zone (Cyan) */}
              <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-cyan-100/30 to-cyan-200/20 rounded-3xl"></div>
              
              {/* Special Topics Zone (Teal) */}
              <div className="absolute top-1/3 left-0 w-1/3 h-1/3 bg-gradient-to-br from-teal-100/30 to-teal-200/20 rounded-3xl"></div>
            </div>
            
            {/* Connection Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* Main Learning Path */}
              <path
                d="M 20% 30% Q 35% 20% 50% 30% Q 65% 40% 80% 50% Q 70% 60% 50% 60% Q 30% 70% 10% 70% Q 20% 80% 30% 80% Q 40% 70% 60% 40% Q 80% 60% 85% 75% Q 15% 50% 20% 30%"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="10,5"
                className="path-flow"
              />
              
              {/* Secondary Connections */}
              <path
                d="M 20% 30% L 70% 20%"
                stroke="rgba(147, 51, 234, 0.4)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="path-flow"
                style={{ animationDelay: '1s' }}
              />
              <path
                d="M 50% 60% L 80% 50%"
                stroke="rgba(220, 38, 127, 0.4)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="path-flow"
                style={{ animationDelay: '2s' }}
              />
              <path
                d="M 10% 70% L 30% 80%"
                stroke="rgba(34, 197, 94, 0.4)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="path-flow"
                style={{ animationDelay: '3s' }}
              />
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="25%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#EF4444" stopOpacity="0.6" />
                  <stop offset="75%" stopColor="#10B981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* City Landmarks with Progress Indicators */}
            <div className="relative z-10 h-full">
              {cityLandmarks.map((landmark, index) => {
                const isCompleted = Math.random() > 0.5; // Mock completion status
                const isLocked = index > 2; // Mock locked status
                
                return (
                  <button
                    key={landmark.id}
                    onClick={() => !isLocked && onNavigate('category', { id: landmark.category, name: landmark.name })}
                    className={`group absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isLocked ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 cursor-pointer'
                    }`}
                    style={{
                      left: `${landmark.position.x}%`,
                      top: `${landmark.position.y}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Progress Ring */}
                    {!isLocked && (
                      <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-gray-200">
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-teal-500 transition-all duration-1000"
                          style={{
                            clipPath: `polygon(0 0, ${isCompleted ? '100' : '30'}% 0, ${isCompleted ? '100' : '30'}% 100%, 0 100%)`
                          }}
                        ></div>
                      </div>
                    )}
                    
                    {/* Landmark Building */}
                    <div className={`
                      relative bg-gradient-to-br ${landmark.color} 
                      ${landmark.size === 'large' ? 'w-16 h-16' : 'w-12 h-12'}
                      rounded-2xl shadow-lg hover:shadow-2xl 
                      flex items-center justify-center
                      group-hover:rotate-3 transition-all duration-300
                      border-4 border-white
                      ${isCompleted ? 'pulse-glow' : ''}
                      ${isLocked ? 'grayscale' : ''}
                    `}>
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {isLocked ? '🔒' : landmark.icon}
                      </span>
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      
                      {/* Completion Checkmark */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Landmark Label */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-200 whitespace-nowrap z-20">
                      <div className="text-sm font-bold text-gray-800">{landmark.landmark}</div>
                      <div className="text-xs text-gray-600">{landmark.name}</div>
                      {isLocked && (
                        <div className="text-xs text-red-500 font-medium">🔒 Locked</div>
                      )}
                      {isCompleted && (
                        <div className="text-xs text-green-500 font-medium">✓ Completed</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* City Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">🗺️ Biology City Map</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded mr-2"></div>
                  <span>Foundations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded mr-2"></div>
                  <span>Genetics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded mr-2"></div>
                  <span>Ecology</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded mr-2"></div>
                  <span>Anatomy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded mr-2"></div>
                  <span>Microbiology</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded mr-2"></div>
                  <span>Biotech</span>
                </div>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2 text-sm">📊 Progress</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">3/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="font-medium text-blue-600">7/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Locked:</span>
                  <span className="font-medium text-gray-500">0/10</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('tracks')}
              className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-1 flex items-center mx-auto"
            >
              <BookOpen className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Suggested Learning Journey Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🗺️ Suggested Learning Journey
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                New to biology? Start at <strong>Cell City Hall</strong> (Foundations), then explore 
                <strong> Genome Vault</strong> (Genetics), and continue through the city at your own pace.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('category', { id: 'foundations-biology', name: 'Foundations of Biology' })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  🏛️ Start at Cell City Hall
                </button>
                <button
                  onClick={() => onNavigate('tracks')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
                >
                  🎯 Browse All Tracks
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
