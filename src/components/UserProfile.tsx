import { useState } from 'react';
import { User, Mail, Calendar, Award, Clock, Settings, LogOut, Crown, Zap, Star, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types/navigation';
import AuthDemo from './AuthDemo';

interface UserProfileProps extends NavigationProps {
  onClose: () => void;
}

export default function UserProfile({ onNavigate, onClose }: UserProfileProps) {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateUser({
      name: editData.name,
      email: editData.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
  };

  const getSubscriptionBadge = () => {
    const { tier, status } = user.subscription;
    
    if (status !== 'active') {
      return { text: 'Inactive', color: 'bg-red-100 text-red-700' };
    }
    
    switch (tier) {
      case 'trial':
        return { text: 'Free Trial', color: 'bg-blue-100 text-blue-700' };
      case 'monthly':
        return { text: 'Monthly Pro', color: 'bg-teal-100 text-teal-700' };
      case 'yearly':
        return { text: 'Yearly Pro', color: 'bg-purple-100 text-purple-700' };
      default:
        return { text: 'Free', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const getSubscriptionIcon = () => {
    const { tier } = user.subscription;
    switch (tier) {
      case 'trial':
        return <Star className="w-4 h-4" />;
      case 'monthly':
        return <Zap className="w-4 h-4" />;
      case 'yearly':
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const subscriptionBadge = getSubscriptionBadge();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile & Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Auth Demo */}
          <div className="mb-8">
            <AuthDemo />
          </div>

          {/* Profile Section */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">{user.avatar}</span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${subscriptionBadge.color}`}>
                {getSubscriptionIcon()}
                {subscriptionBadge.text}
              </span>
              {user.subscription.tier === 'trial' && user.subscription.trialEndsAt && (
                <span className="text-sm text-gray-600">
                  Trial ends {new Date(user.subscription.trialEndsAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.progress.completedTracks.length}</div>
              <div className="text-sm text-gray-600">Tracks Completed</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.progress.completedLessons.length}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.progress.totalHours}</div>
              <div className="text-sm text-gray-600">Hours Learned</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{user.progress.badges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Member since</span>
                </div>
                <span className="text-gray-800 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Account ID</span>
                </div>
                <span className="text-gray-800 font-mono text-sm">
                  {user.id.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onNavigate('pricing');
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              Manage Subscription
            </button>
            
            <button
              onClick={() => {
                logout();
                onClose();
                onNavigate('home');
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
