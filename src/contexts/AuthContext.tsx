import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: {
    tier: 'free' | 'monthly' | 'yearly' | 'trial';
    status: 'active' | 'expired' | 'cancelled';
    expiresAt?: string;
    trialEndsAt?: string;
  };
  progress: {
    completedLessons: string[];
    completedTracks: string[];
    totalHours: number;
    badges: string[];
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAccess: (requiredTier?: 'free' | 'monthly' | 'yearly') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from your API
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        avatar: '👤',
        subscription: {
          tier: 'trial', // Default to trial for demo
          status: 'active',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        },
        progress: {
          completedLessons: [],
          completedTracks: [],
          totalHours: 0,
          badges: [],
        },
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        avatar: '👤',
        subscription: {
          tier: 'trial',
          status: 'active',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        progress: {
          completedLessons: [],
          completedTracks: [],
          totalHours: 0,
          badges: [],
        },
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasActiveSubscription = (): boolean => {
    if (!user) return false;
    
    const { subscription } = user;
    
    if (subscription.status !== 'active') return false;
    
    // Check if trial has expired
    if (subscription.tier === 'trial' && subscription.trialEndsAt) {
      const trialEnd = new Date(subscription.trialEndsAt);
      const now = new Date();
      return now < trialEnd;
    }
    
    // Check if paid subscription has expired
    if (subscription.tier !== 'free' && subscription.tier !== 'trial' && subscription.expiresAt) {
      const expiry = new Date(subscription.expiresAt);
      const now = new Date();
      return now < expiry;
    }
    
    return subscription.tier !== 'free';
  };

  const checkAccess = (requiredTier: 'free' | 'monthly' | 'yearly' = 'free'): boolean => {
    if (!user) return false;
    
    if (requiredTier === 'free') return true;
    
    if (!hasActiveSubscription()) return false;
    
    const tierHierarchy = { free: 0, trial: 1, monthly: 1, yearly: 2 };
    const userTier = user.subscription.tier;
    
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= tierHierarchy[requiredTier];
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasActiveSubscription: hasActiveSubscription(),
    login,
    register,
    logout,
    updateUser,
    checkAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
