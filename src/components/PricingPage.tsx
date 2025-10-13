import { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight, BookOpen, Users, Shield, Clock } from 'lucide-react';
import { NavigationProps } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

interface PricingPageProps extends NavigationProps {}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  buttonText: string;
  buttonAction: () => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { user, updateUser } = useAuth();

  const handleSubscribe = (tier: 'monthly' | 'yearly') => {
    if (!user) {
      onNavigate('login');
      return;
    }

    // Simulate subscription update
    const subscription = {
      tier: tier,
      status: 'active' as const,
      expiresAt: new Date(Date.now() + (tier === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    };

    updateUser({ subscription });
    onNavigate('home');
  };

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free Trial',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      features: [
        '7-day free trial',
        'Access to first 3 tracks',
        'Basic progress tracking',
        'Community access',
        'Mobile app access',
      ],
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-gray-100 text-gray-700',
      buttonText: 'Start Free Trial',
      buttonAction: () => handleSubscribe('monthly'),
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      description: 'Full access for serious learners',
      price: { monthly: 19, yearly: 190 },
      features: [
        'All 100+ biology tracks',
        'Interactive quizzes & flashcards',
        'AI-powered study recommendations',
        'Progress tracking & analytics',
        'Downloadable study materials',
        'Priority community support',
        'Mobile app with offline access',
        'Certificate of completion',
      ],
      popular: true,
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-teal-100 text-teal-700',
      buttonText: 'Start Monthly Plan',
      buttonAction: () => handleSubscribe('monthly'),
    },
    {
      id: 'yearly',
      name: 'Yearly Pro',
      description: 'Best value for committed learners',
      price: { monthly: 15, yearly: 150 },
      features: [
        'Everything in Monthly Pro',
        'Save 20% with yearly billing',
        'Exclusive yearly content',
        'Advanced analytics dashboard',
        '1-on-1 study consultations',
        'Early access to new features',
        'Premium community features',
        'Lifetime access to updates',
      ],
      icon: <Crown className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-700',
      buttonText: 'Start Yearly Plan',
      buttonAction: () => handleSubscribe('yearly'),
    },
  ];

  const currentUserTier = user?.subscription.tier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-12 h-12 text-teal-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">Choose Your Learning Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock the full potential of biology learning with our comprehensive platform. 
            Start with a free trial or choose a plan that fits your learning goals.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-teal-500 transform scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-full ${tier.color} mb-4`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">
                    ${billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                  {billingCycle === 'yearly' && tier.id !== 'free' && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      ${(tier.price.monthly * 12 - tier.price.yearly).toFixed(0)} savings per year
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={tier.buttonAction}
                disabled={currentUserTier === tier.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  currentUserTier === tier.id
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : tier.popular
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
              >
                {currentUserTier === tier.id ? (
                  'Current Plan'
                ) : (
                  <>
                    {tier.buttonText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What's Included in Each Plan
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">100+ Biology Tracks</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive curriculum covering all major biology topics from beginner to advanced levels.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Access</h3>
              <p className="text-gray-600 text-sm">
                Join discussions, ask questions, and learn from fellow biology enthusiasts and experts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor your learning journey with detailed analytics and personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Access</h3>
              <p className="text-gray-600 text-sm">
                Learn anywhere with our mobile app featuring offline access and sync across devices.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! Start with a 7-day free trial to explore all features. No credit card required to begin.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for yearly subscriptions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('home')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
