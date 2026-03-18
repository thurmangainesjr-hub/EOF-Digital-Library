/**
 * Membership Routes
 *
 * Handles Stripe subscriptions for $5/month membership
 */

import express from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MEMBERSHIP_PRICE_ID = process.env.STRIPE_PRICE_ID;

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

// Subscribe to membership
router.post('/subscribe', requireAuth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    let membership = await prisma.membership.findUnique({
      where: { userId: req.user.id }
    });

    // Create or get Stripe customer
    let customerId = membership?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      customerId = customer.id;
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: MEMBERSHIP_PRICE_ID }],
      expand: ['latest_invoice.payment_intent']
    });

    // Update membership in database
    membership = await prisma.membership.update({
      where: { userId: req.user.id },
      data: {
        tier: 'MEMBER',
        status: 'ACTIVE',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    res.json({
      success: true,
      data: {
        membership,
        subscriptionId: subscription.id
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Subscription failed'
    });
  }
});

// Cancel subscription
router.post('/cancel', requireAuth, async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      error: 'Cancellation failed'
    });
  }
});

// Stripe webhook
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    res.json({ received: true });
  }
);

async function handleSubscriptionChange(subscription) {
  const membership = await prisma.membership.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!membership) return;

  await prisma.membership.update({
    where: { id: membership.id },
    data: {
      status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
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

export default router;
