import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import {
  FiCheck, FiStar, FiZap, FiBook, FiUsers,
  FiCreditCard, FiLock
} from 'react-icons/fi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/memberships/subscribe');
      return res.data.data;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { clientSecret } = await subscribeMutation.mutateAsync();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-black/30 border border-yellow-600/20">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: '#6b7280'
                }
              }
            }
          }}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {processing ? (
          'Processing...'
        ) : (
          <>
            <FiCreditCard /> Subscribe - $5/month
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <FiLock size={14} /> Secure payment powered by Stripe
      </p>
    </form>
  );
}

function Membership() {
  const navigate = useNavigate();
  const { user, isMember, isCreator, isAuthenticated } = useAuth();
  const [showPayment, setShowPayment] = useState(false);

  const currentTier = user?.membership?.tier || 'FREE';

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
      current: currentTier === 'FREE'
    },
    {
      id: 'MEMBER',
      name: 'Member',
      price: 5,
      features: [
        'Everything in Free',
        'Access creator content',
        'Export to Griot AI',
        'Create audiobook adaptations',
        'Create screenplay adaptations',
        'Priority support'
      ],
      color: 'from-yellow-600 to-yellow-700',
      highlight: true,
      current: currentTier === 'MEMBER'
    },
    {
      id: 'CREATOR',
      name: 'Creator',
      price: 'Apply',
      features: [
        'Everything in Member',
        'Publish your books',
        'Set adaptation prices',
        'Earn from adaptations',
        'Analytics dashboard',
        'Creator badge'
      ],
      color: 'from-purple-600 to-purple-700',
      current: currentTier === 'CREATOR'
    }
  ];

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
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
                className="w-full btn-primary"
              >
                Subscribe Now
              </button>
            ) : tier.id === 'CREATOR' && !isCreator ? (
              <button className="w-full btn-secondary">
                Apply to Become Creator
              </button>
            ) : tier.id === 'FREE' && currentTier !== 'FREE' ? (
              <button className="w-full btn-secondary">
                Downgrade
              </button>
            ) : null}
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full m-4"
          >
            <h2 className="font-serif text-2xl text-white mb-6">Subscribe to Member</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                onSuccess={() => {
                  setShowPayment(false);
                  window.location.reload();
                }}
              />
            </Elements>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

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
              your current billing period.
            </p>
          </div>
          <div className="card">
            <h3 className="text-white font-medium mb-2">How do I become a Creator?</h3>
            <p className="text-gray-400">
              Apply through the Creator application process. We review each application to ensure
              quality content. Approved creators can publish books and earn from adaptations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Membership;
