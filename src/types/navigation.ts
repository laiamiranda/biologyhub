export type ViewType = 'home' | 'tracks' | 'category' | 'track' | 'lesson' | 'progress' | 'quizzes' | 'news' | 'glossary';

export interface NavigationProps {
  onNavigate: (view: ViewType, data?: any) => void;
}
