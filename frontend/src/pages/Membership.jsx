import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FiCheck, FiStar, FiZap, FiBook, FiUsers,
  FiCreditCard, FiLock, FiExternalLink, FiSettings,
  FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';

function Membership() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [message, setMessage] = useState(null);

  // Check for success/cancel from Stripe redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    if (sessionId) {
      // Verify the session and activate membership
      verifySession(sessionId);
    } else if (canceled) {
      setMessage({ type: 'info', text: 'Checkout was canceled. You can try again anytime.' });
    }
  }, [searchParams]);

  // Verify checkout session
  const verifySession = async (sessionId) => {
    try {
      await api.post('/memberships/verify-session', { sessionId });
      setMessage({ type: 'success', text: 'Welcome! Your membership is now active.' });
      if (refreshUser) refreshUser();
      // Clear the URL params
      navigate('/membership', { replace: true });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to verify payment. Please contact support.' });
    }
  };

  // Get current membership status
  const { data: membershipData } = useQuery({
    queryKey: ['membership'],
    queryFn: async () => {
      const res = await api.get('/memberships/me');
      return res.data.data?.membership;
    },
    enabled: isAuthenticated
  });

  // Get Stripe config
  const { data: stripeConfig } = useQuery({
    queryKey: ['stripe-config'],
    queryFn: async () => {
      const res = await api.get('/memberships/config');
      return res.data.data;
    }
  });

  // Create checkout session
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/memberships/create-checkout-session');
      return res.data.data;
    },
    onSuccess: (data) => {
      if (data.demoMode) {
        // Stripe not configured - offer demo mode
        if (window.confirm('Stripe is not configured. Would you like to activate a demo membership instead?')) {
          demoMutation.mutate();
        }
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to start checkout'
      });
    }
  });

  // Demo mode subscription
  const demoMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/memberships/demo-subscribe');
      return res.data.data;
    },
    onSuccess: (data) => {
      setMessage({
        type: 'success',
        text: data.message || 'Demo membership activated!'
      });
      if (refreshUser) refreshUser();
    },
    onError: (error) => {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to activate demo'
      });
    }
  });

  // Create portal session (manage subscription)
  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/memberships/create-portal-session');
      return res.data.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    }
  });

  const currentTier = membershipData?.tier || user?.membership?.tier || 'FREE';
  const isActive = membershipData?.status === 'ACTIVE';
  const isMember = currentTier === 'MEMBER' && isActive;
  const isCreator = currentTier === 'CREATOR';

  const tiers = [
    {
      id: 'FREE',
      name: 'Free',
      price: 0,
      features: [
        'Browse full library catalog',
        'Read public domain books',
        'Create bookshelves',
        'Track reading progress'
      ],
      color: 'from-gray-600 to-gray-700',
      current: currentTier === 'FREE' || !isActive
    },
    {
      id: 'MEMBER',
      name: 'Member',
      price: 5,
      features: [
        'Everything in Free',
        'Access creator content',
        'Unlimited book downloads',
        'Ad-free reading experience',
        'Reading statistics & insights',
        'Priority support'
      ],
      color: 'from-yellow-600 to-yellow-700',
      highlight: true,
      current: isMember
    },
    {
      id: 'CREATOR',
      name: 'Creator',
      price: 'Apply',
      features: [
        'Everything in Member',
        'Export to Griot AI Studio',
        'Create audiobook & screenplay adaptations',
        'Creator Community chat room',
        'Adaptation placement list',
        'Publish your books',
        'Earn from adaptations',
        'Analytics dashboard',
        'Creator badge'
      ],
      color: 'from-purple-600 to-purple-700',
      current: isCreator
    }
  ];

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/membership');
      return;
    }
    checkoutMutation.mutate();
  };

  const handleManageSubscription = () => {
    portalMutation.mutate();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-serif text-4xl text-white mb-4">Membership Plans</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Unlock the full potential of EOF Digital Library and Griot AI integration
        </p>
      </motion.div>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-xl mx-auto mb-8 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' :
            message.type === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}
        >
          {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          {message.text}
        </motion.div>
      )}

      {/* Stripe not configured warning */}
      {stripeConfig && !stripeConfig.isConfigured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto mb-8 p-4 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center gap-3"
        >
          <FiAlertCircle size={20} />
          <span>Payment system is in test mode. Configure Stripe API keys to enable payments.</span>
        </motion.div>
      )}

      {/* Current Membership Status */}
      {isAuthenticated && membershipData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-8 card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current Plan</p>
              <p className="text-xl text-white font-medium">
                {membershipData.tier} {isActive && <span className="text-green-400">(Active)</span>}
              </p>
              {membershipData.currentPeriodEnd && isActive && (
                <p className="text-sm text-gray-500">
                  Renews {new Date(membershipData.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
              {membershipData.cancelAtPeriodEnd && (
                <p className="text-sm text-yellow-500">
                  Cancels at end of period
                </p>
              )}
            </div>
            {isMember && (
              <button
                onClick={handleManageSubscription}
                disabled={portalMutation.isPending}
                className="btn-secondary flex items-center gap-2"
              >
                <FiSettings /> Manage
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card relative ${tier.highlight ? 'border-yellow-500/50 gold-glow' : ''}`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}

            {tier.current && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  CURRENT
                </span>
              </div>
            )}

            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6`}>
              {tier.id === 'FREE' && <FiBook className="text-white" size={28} />}
              {tier.id === 'MEMBER' && <FiStar className="text-white" size={28} />}
              {tier.id === 'CREATOR' && <FiZap className="text-white" size={28} />}
            </div>

            <h2 className="font-serif text-2xl text-white mb-2">{tier.name}</h2>
            <p className="text-3xl font-bold text-white mb-6">
              {typeof tier.price === 'number' ? (
                <>
                  ${tier.price}
                  {tier.price > 0 && <span className="text-sm font-normal text-gray-400">/month</span>}
                </>
              ) : (
                tier.price
              )}
            </p>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-2 text-gray-300">
                  <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {tier.current ? (
              <button
                disabled
                className="w-full py-3 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : tier.id === 'MEMBER' && !isMember ? (
              <button
                onClick={handleSubscribe}
                disabled={checkoutMutation.isPending}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {checkoutMutation.isPending ? (
                  'Redirecting...'
                ) : (
                  <>
                    <FiCreditCard /> Subscribe Now
                  </>
                )}
              </button>
            ) : tier.id === 'CREATOR' && !isCreator ? (
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                Apply to Become Creator
              </button>
            ) : tier.id === 'FREE' && isMember ? (
              <button
                onClick={handleManageSubscription}
                className="w-full btn-secondary"
              >
                Manage Subscription
              </button>
            ) : null}
          </motion.div>
        ))}
      </div>

      {/* Security Note */}
      <div className="text-center mb-12">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <FiLock /> Payments secured by Stripe. We never store your card details.
        </p>
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="font-serif text-2xl text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-white font-medium mb-2">What is Griot AI integration?</h3>
            <p className="text-gray-400">
              Members can export books to Griot AI Studio to create professional audiobook narrations,
              screenplay adaptations, video game narratives, and more.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-medium mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-400">
              Yes, you can cancel your membership at any time. You'll retain access until the end of
              your current billing period. Use the "Manage" button to cancel or update payment.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-medium mb-2">How do I become a Creator?</h3>
            <p className="text-gray-400">
              Apply through the Creator application process. We review each application to ensure
              quality content. Approved creators can publish books and earn from adaptations.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-medium mb-2">Is my payment information secure?</h3>
            <p className="text-gray-400">
              Absolutely. All payments are processed by Stripe, a PCI-compliant payment processor.
              We never have access to your full card details.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Membership;
