import { useEffect, useState } from 'react';
import { supabase, Track, Lesson } from '../lib/supabase';
import { Award, TrendingUp, Clock, BookOpen } from 'lucide-react';

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
  percentage: number;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    const [tracksRes, lessonsRes, progressRes] = await Promise.all([
      supabase.from('tracks').select('*'),
      supabase.from('lessons').select('*'),
      supabase.from('user_progress').select('*').eq('user_id', userId).eq('completed', true),
    ]);

    if (!tracksRes.data || !lessonsRes.data || !progressRes.data) {
      setLoading(false);
      return;
    }

    const tracks = tracksRes.data;
    const lessons = lessonsRes.data;
    const completedProgress = progressRes.data;

    const completedLessonIds = new Set(completedProgress.map((p) => p.lesson_id));

    const trackProgressMap: Map<string, TrackProgress> = new Map();

    tracks.forEach((track) => {
      const trackLessons = lessons.filter((l) => l.track_id === track.id);
      const completedCount = trackLessons.filter((l) => completedLessonIds.has(l.id)).length;
      const percentage =
        trackLessons.length > 0 ? Math.round((completedCount / trackLessons.length) * 100) : 0;

      if (completedCount > 0) {
        trackProgressMap.set(track.id, {
          track,
          totalLessons: trackLessons.length,
          completedLessons: completedCount,
          percentage,
        });
      }
    });

    const sortedProgress = Array.from(trackProgressMap.values()).sort(
      (a, b) => b.percentage - a.percentage
    );

    const completedTracksCount = sortedProgress.filter((tp) => tp.percentage === 100).length;
    const totalHours = tracks.reduce((sum, t) => sum + t.estimated_hours, 0);
    const completedHours = sortedProgress.reduce((sum, tp) => {
      return sum + (tp.track.estimated_hours * tp.percentage) / 100;
    }, 0);

    setStats({
      totalTracks: tracks.length,
      completedTracks: completedTracksCount,
      totalLessons: lessons.length,
      completedLessons: completedProgress.length,
      totalHours,
      completedHours: Math.round(completedHours),
    });

    setTrackProgress(sortedProgress);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!localStorage.getItem('userId') || trackProgress.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Learning Journey</h2>
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
        </div>
      </div>
    );
  }

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

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tracks in Progress</h2>
          <div className="space-y-4">
            {trackProgress.map(({ track, totalLessons, completedLessons, percentage }) => (
              <div
                key={track.id}
                onClick={() => onNavigate('track', track)}
                className="p-6 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-teal-600">
                        Track {track.track_number}
                      </span>
                      {percentage === 100 && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{track.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-teal-600">{percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
