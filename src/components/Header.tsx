import { BookOpen, Search } from 'lucide-react';
import { ViewType } from '../types/navigation';
import { useState } from 'react';
import AISearchComponent from './AISearchComponent';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  currentView: string;
  onNavigate: (view: ViewType) => void;
}

export default function Header({ onSearchChange, currentView, onNavigate }: HeaderProps) {
  const [showAISearch, setShowAISearch] = useState(false);

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
            </nav>

            <div className="flex items-center space-x-4">
              {onSearchChange && (
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-200" />
                  <input
                    type="text"
                    placeholder="Search tracks or lessons..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white/10 border border-white/20 placeholder-teal-200 text-white focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                  />
                </div>
              )}
              <button
                onClick={() => setShowAISearch(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">AI Search</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* AI Search Modal */}
      {showAISearch && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <AISearchComponent
                onNavigate={onNavigate}
                onClose={() => setShowAISearch(false)}
                placeholder="Search with AI - ask questions, find concepts, explore biology..."
                showRecommendations={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
