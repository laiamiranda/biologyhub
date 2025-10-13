import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TracksPage from './components/TracksPage';
import TrackDetail from './components/TrackDetail';
import LessonViewer from './components/LessonViewer';
import ProgressPage from './components/ProgressPage';
import QuizPage from './components/QuizPage';
import BioNewsPage from './components/BioNewsPage';
import GlossaryPage from './components/GlossaryPage';
import CommunityPage from './components/CommunityPage';
import LoginPage from './components/LoginPage';
import PricingPage from './components/PricingPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import { Track, Lesson, Category } from './lib/api';
import { ViewType } from './types/navigation';

interface ViewState {
  view: ViewType;
  data?: any;
}

function App() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'home' });
  const [showUserProfile, setShowUserProfile] = useState(false);

  const navigate = (view: ViewType, data?: any) => {
    setViewState({ view, data });
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (viewState.view) {
      case 'home':
        return <HomePage onNavigate={navigate} />;

      case 'login':
        return <LoginPage onNavigate={navigate} />;

      case 'pricing':
        return <PricingPage onNavigate={navigate} />;

      case 'tracks':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="monthly">
            <TracksPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'category':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="monthly">
            <TracksPage
              onNavigate={navigate}
              selectedCategory={viewState.data as Category}
            />
          </ProtectedRoute>
        );

      case 'track':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="monthly">
            <TrackDetail track={viewState.data as Track} onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'lesson':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="monthly">
            <LessonViewer
              lesson={viewState.data.lesson as Lesson}
              track={viewState.data.track as Track}
              onNavigate={navigate}
            />
          </ProtectedRoute>
        );

      case 'progress':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="free">
            <ProgressPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'quizzes':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="monthly">
            <QuizPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'news':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="free">
            <BioNewsPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'glossary':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="free">
            <GlossaryPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      case 'community':
        return (
          <ProtectedRoute onNavigate={navigate} requiredTier="free">
            <CommunityPage onNavigate={navigate} />
          </ProtectedRoute>
        );

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          currentView={viewState.view}
          onNavigate={navigate}
          onShowProfile={() => setShowUserProfile(true)}
        />
        {renderView()}
        
        {showUserProfile && (
          <UserProfile
            onNavigate={navigate}
            onClose={() => setShowUserProfile(false)}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
