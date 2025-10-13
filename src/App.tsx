import { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TracksPage from './components/TracksPage';
import TrackDetail from './components/TrackDetail';
import LessonViewer from './components/LessonViewer';
import ProgressPage from './components/ProgressPage';
import { Track, Lesson, Category } from './lib/supabase';

type ViewType = 'home' | 'tracks' | 'category' | 'track' | 'lesson' | 'progress';

interface ViewState {
  view: ViewType;
  data?: any;
}

function App() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'home' });
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (view: ViewType, data?: any) => {
    setViewState({ view, data });
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (viewState.view) {
      case 'home':
        return <HomePage onNavigate={navigate} />;

      case 'tracks':
        return <TracksPage onNavigate={navigate} />;

      case 'category':
        return (
          <TracksPage
            onNavigate={navigate}
            selectedCategory={viewState.data as Category}
          />
        );

      case 'track':
        return <TrackDetail track={viewState.data as Track} onNavigate={navigate} />;

      case 'lesson':
        return (
          <LessonViewer
            lesson={viewState.data.lesson as Lesson}
            track={viewState.data.track as Track}
            onNavigate={navigate}
          />
        );

      case 'progress':
        return <ProgressPage onNavigate={navigate} />;

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearchChange={setSearchQuery}
        currentView={viewState.view}
        onNavigate={(view: string) => navigate(view as ViewType)}
      />
      {renderView()}
    </div>
  );
}

export default App;
