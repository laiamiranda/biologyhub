import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types/navigation';
import LoginPage from './LoginPage';
import PricingPage from './PricingPage';

interface ProtectedRouteProps extends NavigationProps {
  children: ReactNode;
  requiredTier?: 'free' | 'monthly' | 'yearly';
  fallbackComponent?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredTier = 'free', 
  fallbackComponent,
  onNavigate 
}: ProtectedRouteProps) {
  const { isAuthenticated, checkAccess, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginPage onNavigate={onNavigate} />;
  }

  // Authenticated but doesn't have required access level
  if (!checkAccess(requiredTier)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    // Default fallback - show pricing page
    return <PricingPage onNavigate={onNavigate} />;
  }

  // Has required access - show protected content
  return <>{children}</>;
}
