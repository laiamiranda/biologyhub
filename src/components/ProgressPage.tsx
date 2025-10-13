import { useEffect, useState } from 'react';
import { Track, Lesson, Category, getTracks, getLessons, getUserProgress, getCategories } from '../lib/api';
import { Award, TrendingUp, Clock, BookOpen, Calendar, Target, Zap } from 'lucide-react';
import StudyPlanner from './StudyPlanner';

import { NavigationProps } from '../types/navigation';

interface ProgressPageProps extends NavigationProps {}

interface ProgressStats {
  totalTracks: number;
  completedTracks: number;
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  completedHours: number;
}

interface TrackProgress {
  track: Track;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  completedLessonsList: Lesson[];
}

interface UnitProgress {
  category: string;
  tracks: TrackProgress[];
  totalTracks: number;
  completedTracks: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  isExpanded: boolean;
}

export default function ProgressPage({ onNavigate }: ProgressPageProps) {
  const [stats, setStats] = useState<ProgressStats>({
    totalTracks: 0,
    completedTracks: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalHours: 0,
    completedHours: 0,
  });
  const [unitProgress, setUnitProgress] = useState<UnitProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const groupTracksByCategory = (tracks: Track[], categories: Category[]): Map<string, Track[]> => {
    const categoryMap = new Map<string, Track[]>();
    
    tracks.forEach(track => {
      // Find the category by category_id
      const category = categories.find(cat => cat.id === track.category_id);
      const categoryName = category ? category.name : 'General Biology';
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }
      categoryMap.get(categoryName)!.push(track);
    });
    
    return categoryMap;
  };

  const createUnitProgress = (trackProgress: TrackProgress[], categories: Category[]): UnitProgress[] => {
    const categoryMap = groupTracksByCategory(trackProgress.map(tp => tp.track), categories);
    const unitProgress: UnitProgress[] = [];
    
    categoryMap.forEach((tracks, category) => {
      const tracksInCategory = trackProgress.filter(tp => 
        tracks.some(t => t.id === tp.track.id)
      );
      
      const totalTracks = tracksInCategory.length;
      const completedTracks = tracksInCategory.filter(tp => tp.progressPercentage === 100).length;
      const totalLessons = tracksInCategory.reduce((sum, tp) => sum + tp.totalLessons, 0);
      const completedLessons = tracksInCategory.reduce((sum, tp) => sum + tp.completedLessons, 0);
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      unitProgress.push({
        category,
        tracks: tracksInCategory,
        totalTracks,
        completedTracks,
        totalLessons,
        completedLessons,
        progressPercentage,
        isExpanded: false,
      });
    });
    
    return unitProgress.sort((a, b) => b.progressPercentage - a.progressPercentage);
  };

  const loadProgress = async () => {
    const userId = localStorage.getItem('userId') || 'temp-user';
    
    try {
      const [tracksData, progressData, categoriesData] = await Promise.all([
        getTracks(),
        getUserProgress(userId),
        getCategories(),
      ]);

      const tracks = tracksData;
      const completedProgress = progressData.filter(p => p.completed);
    const completedLessonIds = new Set(completedProgress.map((p) => p.lesson_id));

    const trackProgressMap: Map<string, TrackProgress> = new Map();

      // Calculate progress for each track
      for (const track of tracks) {
        const trackLessons = await getLessons(track.id);
        const completedInTrack = trackLessons.filter((lesson) => completedLessonIds.has(lesson.id));
        const progressPercentage = trackLessons.length > 0 ? (completedInTrack.length / trackLessons.length) * 100 : 0;

        trackProgressMap.set(track.id, {
          track,
          totalLessons: trackLessons.length,
          completedLessons: completedInTrack.length,
          progressPercentage,
          completedLessonsList: completedInTrack,
        });
      }

    const sortedProgress = Array.from(trackProgressMap.values()).sort(
        (a, b) => b.progressPercentage - a.progressPercentage
    );

      const completedTracksCount = sortedProgress.filter((tp) => tp.progressPercentage === 100).length;
    const totalHours = tracks.reduce((sum, t) => sum + t.estimated_hours, 0);
    const completedHours = sortedProgress.reduce((sum, tp) => {
        return sum + (tp.track.estimated_hours * tp.progressPercentage) / 100;
    }, 0);

      // Calculate total lessons across all tracks
      let totalLessons = 0;
      for (const track of tracks) {
        const trackLessons = await getLessons(track.id);
        totalLessons += trackLessons.length;
      }

    setStats({
      totalTracks: tracks.length,
      completedTracks: completedTracksCount,
        totalLessons,
      completedLessons: completedProgress.length,
      totalHours,
      completedHours: Math.round(completedHours),
    });

    setUnitProgress(createUnitProgress(sortedProgress, categoriesData));
      setAllTracks(tracks);
      
      // Collect all lessons for study planner
      const allLessonsData: Lesson[] = [];
      for (const track of tracks) {
        const trackLessons = await getLessons(track.id);
        allLessonsData.push(...trackLessons);
      }
      setAllLessons(allLessonsData);
    } catch (error) {
      console.error('Failed to load progress:', error);
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

  // Generate a temporary userId if none exists
  if (!localStorage.getItem('userId')) {
    const tempUserId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', tempUserId);
  }

  const toggleUnitExpansion = (category: string) => {
    setUnitProgress(prev => prev.map(unit => 
      unit.category === category 
        ? { ...unit, isExpanded: !unit.isExpanded }
        : unit
    ));
  };

  const overallProgress =
    stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Modern Hero Header */}
      <section className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-teal-100 mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Learning Dashboard
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Learning
              <span className="block text-3xl lg:text-4xl text-teal-100 font-light mt-2">
                Progress Dashboard
              </span>
            </h1>
            
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Track your biology learning journey with detailed analytics, smart insights, and personalized recommendations.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-teal-600 mb-1">{stats.completedLessons}</div>
                <div className="text-sm text-gray-500">of {stats.totalLessons}</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Lessons Completed</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full transition-all duration-500"
                style={{ width: `${stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-cyan-600 mb-1">{stats.completedTracks}</div>
                <div className="text-sm text-gray-500">of {stats.totalTracks}</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Tracks Finished</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full transition-all duration-500"
                style={{ width: `${stats.totalTracks > 0 ? (stats.completedTracks / stats.totalTracks) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-600 mb-1">{stats.completedHours}</div>
                <div className="text-sm text-gray-500">of {stats.totalHours}h</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hours Learned</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-500"
                style={{ width: `${stats.totalHours > 0 ? (stats.completedHours / stats.totalHours) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600 mb-1">{overallProgress}%</div>
                <div className="text-sm text-gray-500">overall</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modern Study Planner Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 mb-12 border border-indigo-100 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center mb-6 lg:mb-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mr-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Study Planner & Calendar</h2>
                <p className="text-lg text-gray-600">Plan your learning journey with AI-powered suggestions and smart scheduling</p>
              </div>
            </div>
            <button
              onClick={() => setShowStudyPlanner(true)}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Open Study Planner
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white p-6 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Smart Scheduling</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">AI suggests optimal study times based on your progress, learning patterns, and personal goals.</p>
            </div>
            
            <div className="group bg-white p-6 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-yellow-600" />
              </div>
                <h3 className="text-xl font-bold text-gray-800">Pacing Suggestions</h3>
            </div>
              <p className="text-gray-600 leading-relaxed">Get personalized recommendations for study pace, deadlines, and milestone achievements.</p>
          </div>

            <div className="group bg-white p-6 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Progress Tracking</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Monitor your study sessions, track completion rates, and analyze learning patterns.</p>
              </div>
            </div>
          </div>

        {/* Modern Units in Progress Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Units in Progress</h2>
              <p className="text-gray-600">Track your progress across different biology units and categories</p>
              </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{unitProgress.length}</div>
              <div className="text-sm text-gray-500">Active Units</div>
            </div>
          </div>

          {unitProgress.length > 0 ? (
            <div className="space-y-6">
              {unitProgress.map((unit, index) => (
                <div 
                  key={unit.category} 
                  className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Modern Unit Header */}
                  <div
                    onClick={() => toggleUnitExpansion(unit.category)}
                    className="p-8 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{unit.category}</h3>
                            <div className="flex items-center gap-3">
                              <span className="bg-teal-100 text-teal-700 text-sm px-4 py-2 rounded-full font-semibold">
                                {unit.completedTracks} of {unit.totalTracks} tracks completed
                              </span>
                              {unit.progressPercentage === 100 && (
                                <span className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-full font-semibold flex items-center">
                                  <Award className="w-4 h-4 mr-1" />
                                  Unit Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {unit.completedLessons} of {unit.totalLessons} lessons completed
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 h-full transition-all duration-700 relative"
                            style={{ width: `${unit.progressPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-teal-600 mb-1">{Math.round(unit.progressPercentage)}%</div>
                          <div className="text-sm text-gray-500 font-medium">Progress</div>
                        </div>
                        <div className={`transform transition-transform duration-300 ${unit.isExpanded ? 'rotate-180' : ''}`}>
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
              </div>
            </div>
          </div>
        </div>

                  {/* Modern Expanded Tracks */}
                  {unit.isExpanded && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xl font-bold text-gray-800">Tracks in this Unit</h4>
                          <span className="text-sm text-gray-500">{unit.tracks.length} tracks available</span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {unit.tracks.map(({ track, totalLessons, completedLessons, progressPercentage }, trackIndex) => (
              <div
                key={track.id}
                onClick={() => onNavigate('track', track)}
                              className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                              style={{ animationDelay: `${trackIndex * 50}ms` }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-10 h-10 rounded-xl flex items-center justify-center">
                                    <span className="text-sm font-bold text-teal-600">#{track.track_number}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold text-teal-600">Track {track.track_number}</span>
                                    {progressPercentage === 100 && (
                                      <div className="flex items-center mt-1">
                                        <Award className="w-3 h-3 text-green-600 mr-1" />
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Completed
                        </span>
                                      </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                                  <div className="text-2xl font-bold text-teal-600">{Math.round(progressPercentage)}%</div>
                                  <div className="text-xs text-gray-500">progress</div>
                  </div>
                </div>
                              
                              <h5 className="font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                                {track.title}
                              </h5>
                              
                              <p className="text-sm text-gray-600 mb-4">
                                {completedLessons} of {totalLessons} lessons completed
                              </p>
                              
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                                <div
                                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-500 relative"
                                  style={{ width: `${progressPercentage}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{track.estimated_hours}h estimated</span>
                                </div>
                                <div className="flex items-center text-teal-600 font-medium group-hover:translate-x-1 transition-transform">
                                  <span>View Track</span>
                                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <TrendingUp className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Start Your Learning Journey</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                You haven't started any tracks yet. Browse our comprehensive biology courses and begin your learning adventure with 100+ expert-curated tracks!
              </p>
              <button
                onClick={() => onNavigate('tracks')}
                className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Explore All Tracks
              </button>
            </div>
          )}
          </div>

        {/* Study Planner Modal */}
        {showStudyPlanner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
              <StudyPlanner
                onNavigate={onNavigate}
                tracks={allTracks}
                lessons={allLessons}
                onClose={() => setShowStudyPlanner(false)}
              />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
