/**
 * Membership Routes
 *
 * Handles Stripe subscriptions for $5/month membership
 * Uses Stripe Checkout Sessions for secure payment flow
 */

import express from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Initialize Stripe (handle missing key gracefully)
const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const MEMBERSHIP_PRICE_ID = process.env.STRIPE_PRICE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

// Get current membership
router.get('/me', requireAuth, async (req, res) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      data: { membership }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get membership'
    });
  }
});

// Get Stripe config (publishable key for frontend)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
      isConfigured: stripe !== null
    }
  });
});

// Demo mode subscription (when Stripe not configured)
router.post('/demo-subscribe', requireAuth, async (req, res) => {
  try {
    // Update membership to MEMBER in demo mode
    const membership = await prisma.membership.upsert({
      where: { userId: req.user.id },
      update: {
        tier: 'MEMBER',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      create: {
        userId: req.user.id,
        tier: 'MEMBER',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        membership,
        isDemo: true,
        message: 'Demo membership activated! Configure Stripe for real payments.'
      }
    });
  } catch (error) {
    console.error('Demo subscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate demo membership'
    });
  }
});

// Create Checkout Session for subscription
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    if (!stripe) {
      // Return demo mode info instead of error
      return res.status(200).json({
        success: true,
        data: {
          demoMode: true,
          message: 'Stripe not configured. Use demo mode or configure Stripe.',
          demoUrl: '/api/memberships/demo-subscribe'
        }
      });
    }

    const user = req.user;

    // Check if user already has active membership
    const existingMembership = await prisma.membership.findUnique({
      where: { userId: user.id }
    });

    if (existingMembership?.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        error: 'You already have an active membership'
      });
    }

    // Get or create Stripe customer
    let customerId = existingMembership?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName || user.name,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;

      // Update membership with customer ID
      await prisma.membership.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: user.id,
          tier: 'FREE',
          status: 'INACTIVE',
          stripeCustomerId: customerId
        }
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: MEMBERSHIP_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${FRONTEND_URL}/membership?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/membership?canceled=true`,
      metadata: {
        userId: user.id
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create checkout session'
    });
  }
});

// Verify checkout session and activate membership
router.post('/verify-session', requireAuth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        error: 'Stripe is not configured'
      });
    }

    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }

    const subscription = session.subscription;

    // Update membership
    const membership = await prisma.membership.update({
      where: { userId: req.user.id },
      data: {
        tier: 'MEMBER',
        status: 'ACTIVE',
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    res.json({
      success: true,
      data: { membership }
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify session'
    });
  }
});

// Create billing portal session (for managing subscription)
router.post('/create-portal-session', requireAuth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        error: 'Stripe is not configured'
      });
    }

    const membership = await prisma.membership.findUnique({
      where: { userId: req.user.id }
    });

    if (!membership?.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        error: 'No customer found'
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: membership.stripeCustomerId,
      return_url: `${FRONTEND_URL}/membership`
    });

    res.json({
      success: true,
      data: { url: portalSession.url }
    });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create portal session'
    });
  }
});

// Cancel subscription
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        error: 'Stripe is not configured'
      });
    }

    const membership = await prisma.membership.findUnique({
      where: { userId: req.user.id }
    });

    if (!membership?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'No active subscription'
      });
    }

    // Cancel at period end
    await stripe.subscriptions.update(membership.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await prisma.membership.update({
      where: { userId: req.user.id },
      data: {
        cancelAtPeriodEnd: true
      }
    });

    res.json({
      success: true,
      message: 'Subscription will cancel at period end'
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({
      success: false,
      error: 'Cancellation failed'
    });
  }
});

// Stripe webhook (called by Stripe servers)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event:', event.type);

  // Handle events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
  }

  res.json({ received: true });
});

async function handleCheckoutComplete(session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  await prisma.membership.update({
    where: { userId },
    data: {
      tier: 'MEMBER',
      status: 'ACTIVE',
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });

  console.log(`Membership activated for user ${userId}`);
}

async function handleSubscriptionChange(subscription) {
  const membership = await prisma.membership.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      status: subscription.status === 'active' ? 'ACTIVE' :
              subscription.status === 'past_due' ? 'PAST_DUE' : 'INACTIVE',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });
}

async function handleSubscriptionDeleted(subscription) {
  const membership = await prisma.membership.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      tier: 'FREE',
      status: 'CANCELED',
      stripeSubscriptionId: null
    }
  });
}

async function handlePaymentFailed(invoice) {
  const membership = await prisma.membership.findFirst({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: { status: 'PAST_DUE' }
  });
}

async function handlePaymentSucceeded(invoice) {
  if (invoice.billing_reason !== 'subscription_cycle') return;

  const membership = await prisma.membership.findFirst({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      status: 'ACTIVE',
      currentPeriodEnd: new Date(invoice.lines.data[0]?.period?.end * 1000)
    }
  });
}

export default router;
