export type ViewType = 'home' | 'tracks' | 'category' | 'track' | 'lesson' | 'progress' | 'quizzes' | 'news' | 'glossary' | 'community' | 'login' | 'pricing' | 'profile';

export interface NavigationProps {
  onNavigate: (view: ViewType, data?: any) => void;
}
