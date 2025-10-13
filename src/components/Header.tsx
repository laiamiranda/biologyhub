import { BookOpen, Search, User, LogIn, Crown } from 'lucide-react';
import { ViewType } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: ViewType, data?: any) => void;
  onShowProfile: () => void;
}

export default function Header({ currentView, onNavigate, onShowProfile }: HeaderProps) {
  const { isAuthenticated, user, hasActiveSubscription } = useAuth();

  return (
    <>
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">BiologyHub</h1>
                <p className="text-xs text-teal-100">Master Biology, Step by Step</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'home'
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('tracks')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'tracks'
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                All Tracks
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'progress'
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                My Progress
              </button>
              <button
                onClick={() => onNavigate('quizzes')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'quizzes'
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                Quizzes
              </button>
              <button
                onClick={() => onNavigate('news')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'news'
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                Bio News
              </button>
                  <button
                    onClick={() => onNavigate('glossary')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'glossary'
                        ? 'bg-white/20 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    Glossary
                  </button>
                  <button
                    onClick={() => onNavigate('community')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'community'
                        ? 'bg-white/20 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    Community
                  </button>
            </nav>

                <div className="flex items-center space-x-4">

                  {/* Auth Section */}
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                      {!hasActiveSubscription && (
                        <button
                          onClick={() => onNavigate('pricing')}
                          className="flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          Upgrade
                        </button>
                      )}
                      <button
                        onClick={onShowProfile}
                        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <span className="text-lg">{user?.avatar}</span>
                        <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onNavigate('pricing')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                      >
                        View Plans
                      </button>
                      <button
                        onClick={() => onNavigate('login')}
                        className="flex items-center px-4 py-2 bg-white text-teal-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
          </div>
        </div>
      </header>

    </>
  );
}
