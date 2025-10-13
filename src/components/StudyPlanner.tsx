import { useState, useEffect } from 'react';
import { Calendar, Clock, Target, Plus, Edit3, Trash2, CheckCircle, AlertCircle, TrendingUp, BookOpen, Zap, X } from 'lucide-react';
import { Track, Lesson } from '../lib/api';
import { NavigationProps } from '../types/navigation';

interface StudySession {
  id: string;
  title: string;
  description: string;
  trackId: string;
  lessonId?: string;
  type: 'track' | 'lesson' | 'review' | 'quiz' | 'break';
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  aiSuggested: boolean;
  createdAt: string;
}

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  trackIds: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface StudyPlannerProps extends NavigationProps {
  tracks: Track[];
  lessons: Lesson[];
  onClose?: () => void;
}

export default function StudyPlanner({ onNavigate, tracks, lessons, onClose }: StudyPlannerProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [currentView, setCurrentView] = useState<'calendar' | 'timeline' | 'goals'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<StudySession[]>([]);

  useEffect(() => {
    loadStudyData();
  }, []);

  const loadStudyData = () => {
    // Load from localStorage
    const savedSessions = localStorage.getItem('study_sessions');
    const savedGoals = localStorage.getItem('study_goals');
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  };

  const saveStudyData = () => {
    localStorage.setItem('study_sessions', JSON.stringify(sessions));
    localStorage.setItem('study_goals', JSON.stringify(goals));
  };

  useEffect(() => {
    saveStudyData();
  }, [sessions, goals]);

  const generateAISuggestions = async () => {
    try {
      // Generate AI-powered study suggestions based on user progress and goals
      const suggestions: StudySession[] = [
        {
          id: `ai-suggestion-${Date.now()}`,
          title: 'Review DNA Structure',
          description: 'AI suggests reviewing DNA structure concepts for better retention',
          trackId: tracks[0]?.id || '',
          type: 'review',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '10:00',
          duration: 60,
          priority: 'medium',
          status: 'scheduled',
          aiSuggested: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: `ai-suggestion-${Date.now() + 1}`,
          title: 'Practice Quiz: Cell Biology',
          description: 'Take a practice quiz to test your understanding',
          trackId: tracks[1]?.id || '',
          type: 'quiz',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          priority: 'high',
          status: 'scheduled',
          aiSuggested: true,
          createdAt: new Date().toISOString(),
        }
      ];
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    }
  };

  const addSession = (session: Omit<StudySession, 'id' | 'createdAt'>) => {
    const newSession: StudySession = {
      ...session,
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSessions(prev => [...prev, newSession]);
    setShowAddSession(false);
  };

  const updateSession = (id: string, updates: Partial<StudySession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ));
    setEditingSession(null);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const addGoal = (goal: Omit<StudyGoal, 'id' | 'createdAt'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
    setShowAddGoal(false);
  };

  const updateGoal = (id: string, updates: Partial<StudyGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
    setEditingGoal(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => session.date === date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'track': return <BookOpen className="w-4 h-4" />;
      case 'lesson': return <Target className="w-4 h-4" />;
      case 'review': return <TrendingUp className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'break': return <Clock className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUpcomingSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions
      .filter(session => session.date >= today && session.status === 'scheduled')
      .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
      .slice(0, 5);
  };

  const getStudyStats = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const totalSessions = sessions.length;
    const totalStudyTime = sessions
      .filter(s => s.status === 'completed')
      .reduce((total, s) => total + s.duration, 0);
    const activeGoals = goals.filter(g => g.status === 'active').length;
    
    return {
      completedSessions,
      totalSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      totalStudyTime,
      activeGoals
    };
  };

  const stats = getStudyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-teal-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Study Planner</h1>
                <p className="text-gray-600">Plan your biology learning journey</p>
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">{stats.completedSessions}</div>
              <div className="text-sm text-teal-700">Sessions Completed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <div className="text-sm text-blue-700">Completion Rate</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalStudyTime / 60)}h</div>
              <div className="text-sm text-purple-700">Total Study Time</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.activeGoals}</div>
              <div className="text-sm text-green-700">Active Goals</div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'timeline'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setCurrentView('goals')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'goals'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Goals
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Study Calendar</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddSession(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </button>
                  <button
                    onClick={generateAISuggestions}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    AI Suggestions
                  </button>
                </div>
              </div>

              {/* Simple Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = dateStr === new Date().toISOString().split('T')[0];
                  const isSelected = dateStr === selectedDate;
                  const daySessions = getSessionsForDate(dateStr);
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : isToday
                          ? 'bg-teal-100 text-teal-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div>{date.getDate()}</div>
                      {daySessions.length > 0 && (
                        <div className="flex justify-center mt-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Date Sessions */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Sessions for {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                  {getSessionsForDate(selectedDate).map(session => (
                    <div
                      key={session.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(session.type)}
                          <div>
                            <div className="font-medium text-gray-800">{session.title}</div>
                            <div className="text-sm text-gray-600">
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(session.priority)}`}>
                            {session.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <button
                            onClick={() => setEditingSession(session)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>
              <div className="space-y-3">
                {getUpcomingSessions().map(session => (
                  <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-800">{session.title}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} at {formatTime(session.startTime)}
                    </div>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(session.priority)}`}>
                        {session.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {currentView === 'timeline' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Study Timeline</h2>
            <div className="space-y-4">
              {sessions
                .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
                .map((session, index) => (
                  <div key={session.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full ${
                        session.status === 'completed' ? 'bg-green-500' :
                        session.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{session.title}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString()} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(session.priority)}`}>
                            {session.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Goals View */}
        {currentView === 'goals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Study Goals</h2>
              <button
                onClick={() => setShowAddGoal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map(goal => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Session Modal */}
        {showAddSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Study Session</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addSession({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    trackId: formData.get('trackId') as string,
                    type: formData.get('type') as any,
                    date: formData.get('date') as string,
                    startTime: formData.get('startTime') as string,
                    endTime: formData.get('endTime') as string,
                    duration: parseInt(formData.get('duration') as string),
                    priority: formData.get('priority') as any,
                    status: 'scheduled',
                    aiSuggested: false,
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          name="type"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="track">Track Study</option>
                          <option value="lesson">Lesson Review</option>
                          <option value="review">General Review</option>
                          <option value="quiz">Quiz Practice</option>
                          <option value="break">Break</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          name="duration"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddSession(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Add Session
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Study Goal</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addGoal({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    targetDate: formData.get('targetDate') as string,
                    progress: 0,
                    trackIds: [],
                    priority: formData.get('priority') as any,
                    status: 'active',
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                        <input
                          type="date"
                          name="targetDate"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          name="priority"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddGoal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Add Goal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
