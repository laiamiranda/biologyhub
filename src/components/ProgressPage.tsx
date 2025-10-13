import { useEffect, useState } from 'react';
import { Track, Lesson, Category, getTracks, getLessons, getUserProgress, getCategories } from '../lib/api';
import { Award, TrendingUp, Clock, BookOpen, Calendar, Target, Zap } from 'lucide-react';
import StudyPlanner from './StudyPlanner';

interface ProgressPageProps {
  onNavigate: (view: string, data?: any) => void;
}

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
  const [trackProgress, setTrackProgress] = useState<TrackProgress[]>([]);
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

      setTrackProgress(sortedProgress);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Learning Progress</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-3xl font-bold text-teal-600">{stats.completedLessons}</span>
            </div>
            <p className="text-gray-600 font-medium">Lessons Completed</p>
            <p className="text-xs text-gray-500">out of {stats.totalLessons}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-3xl font-bold text-cyan-600">{stats.completedTracks}</span>
            </div>
            <p className="text-gray-600 font-medium">Tracks Finished</p>
            <p className="text-xs text-gray-500">out of {stats.totalTracks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-emerald-600">{stats.completedHours}</span>
            </div>
            <p className="text-gray-600 font-medium">Hours Learned</p>
            <p className="text-xs text-gray-500">out of {stats.totalHours}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-orange-600">{overallProgress}%</span>
            </div>
            <p className="text-gray-600 font-medium">Overall Progress</p>
            <p className="text-xs text-gray-500">across all tracks</p>
          </div>
        </div>

        {/* Study Planner Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Study Planner & Calendar</h2>
                <p className="text-gray-600">Plan your learning journey with AI-powered suggestions</p>
              </div>
            </div>
            <button
              onClick={() => setShowStudyPlanner(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Open Study Planner
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-800">Smart Scheduling</span>
              </div>
              <p className="text-sm text-gray-600">AI suggests optimal study times based on your progress and goals</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold text-gray-800">Pacing Suggestions</span>
              </div>
              <p className="text-sm text-gray-600">Get personalized recommendations for study pace and deadlines</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-gray-800">Progress Tracking</span>
              </div>
              <p className="text-sm text-gray-600">Monitor your study sessions and track completion rates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Units in Progress</h2>
          {unitProgress.length > 0 ? (
            <div className="space-y-4">
              {unitProgress.map((unit) => (
                <div key={unit.category} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Unit Header */}
                  <div
                    onClick={() => toggleUnitExpansion(unit.category)}
                    className="p-6 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{unit.category}</h3>
                          <span className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-full font-medium">
                            {unit.completedTracks} of {unit.totalTracks} tracks completed
                          </span>
                          {unit.progressPercentage === 100 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              Unit Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {unit.completedLessons} of {unit.totalLessons} lessons completed
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-teal-600">{Math.round(unit.progressPercentage)}%</div>
                          <div className="text-sm text-gray-500">Progress</div>
                        </div>
                        <div className={`transform transition-transform ${unit.isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-500"
                        style={{ width: `${unit.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expanded Tracks */}
                  {unit.isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Tracks in this Unit</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {unit.tracks.map(({ track, totalLessons, completedLessons, progressPercentage }) => (
                            <div
                              key={track.id}
                              onClick={() => onNavigate('track', track)}
                              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-teal-600">
                                    Track {track.track_number}
                                  </span>
                                  {progressPercentage === 100 && (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                      Completed
                                    </span>
                                  )}
                                </div>
                                <div className="text-2xl font-bold text-teal-600">{Math.round(progressPercentage)}%</div>
                              </div>
                              <h5 className="font-medium text-gray-800 mb-1">{track.title}</h5>
                              <p className="text-sm text-gray-600 mb-3">
                                {completedLessons} of {totalLessons} lessons completed
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
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
            <div className="text-center py-12">
              <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Start Your Learning Journey</h3>
              <p className="text-gray-600 mb-8">
                Begin exploring tracks to see your progress here. Your achievements and completed
                lessons will be tracked automatically.
              </p>
              <button
                onClick={() => onNavigate('tracks')}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Explore Tracks
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
