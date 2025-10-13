import { useAuth } from '../contexts/AuthContext';
import { Crown, Star, Lock, Check } from 'lucide-react';

export default function AuthDemo() {
  const { user, isAuthenticated, hasActiveSubscription, checkAccess } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🔐 Authentication Demo</h3>
        <p className="text-blue-700 mb-4">
          You're currently viewing as a guest. Create an account to access premium features!
        </p>
        <div className="space-y-2 text-sm text-blue-600">
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            <span>Limited access to free content only</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            <span>Sign up for 7-day free trial</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Authentication Demo</h3>
      <p className="text-green-700 mb-4">
        Welcome, <strong>{user?.name}</strong>! You're logged in with a <strong>{user?.subscription.tier}</strong> account.
      </p>
      
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Access Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              {checkAccess('free') ? <Check className="w-4 h-4 text-green-500 mr-2" /> : <Lock className="w-4 h-4 text-gray-400 mr-2" />}
              <span>Free Content</span>
            </div>
            <div className="flex items-center">
              {checkAccess('monthly') ? <Check className="w-4 h-4 text-green-500 mr-2" /> : <Lock className="w-4 h-4 text-gray-400 mr-2" />}
              <span>Monthly Pro</span>
            </div>
            <div className="flex items-center">
              {checkAccess('yearly') ? <Check className="w-4 h-4 text-green-500 mr-2" /> : <Lock className="w-4 h-4 text-gray-400 mr-2" />}
              <span>Yearly Pro</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Subscription Status</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <Crown className="w-4 h-4 text-purple-500 mr-2" />
              <span>Tier: {user?.subscription.tier}</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${hasActiveSubscription ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Status: {user?.subscription.status}</span>
            </div>
            {user?.subscription.trialEndsAt && (
              <div className="text-xs text-gray-600">
                Trial ends: {new Date(user.subscription.trialEndsAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">Progress</h4>
          <div className="space-y-1 text-xs">
            <div>Tracks: {user?.progress.completedTracks.length} completed</div>
            <div>Lessons: {user?.progress.completedLessons.length} completed</div>
            <div>Hours: {user?.progress.totalHours} learned</div>
            <div>Badges: {user?.progress.badges.length} earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
