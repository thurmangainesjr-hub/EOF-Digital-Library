/**
 * Stripe Setup Helper Routes
 *
 * Helps configure Stripe and provides test mode functionality
 */

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Check Stripe configuration status
router.get('/status', async (req, res) => {
  const config = {
    secretKey: !!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder'),
    publishableKey: !!process.env.STRIPE_PUBLISHABLE_KEY && !process.env.STRIPE_PUBLISHABLE_KEY.includes('placeholder'),
    priceId: !!process.env.STRIPE_PRICE_ID && !process.env.STRIPE_PRICE_ID.includes('placeholder'),
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('placeholder')
  };

  const isConfigured = config.secretKey && config.publishableKey && config.priceId;
  const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');

  res.json({
    success: true,
    data: {
      isConfigured,
      isTestMode,
      config,
      instructions: !isConfigured ? getSetupInstructions() : null
    }
  });
});

// Create a test product and price (for setup)
router.post('/create-product', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      return res.status(400).json({
        success: false,
        error: 'Stripe secret key not configured',
        instructions: getSetupInstructions()
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Check if product already exists
    const products = await stripe.products.list({ limit: 10 });
    let product = products.data.find(p => p.name === 'EOF Library Membership');

    if (!product) {
      // Create product
      product = await stripe.products.create({
        name: 'EOF Library Membership',
        description: 'Monthly membership for EOF Digital Library - Access creator content, Griot AI integration, and more.',
        metadata: {
          tier: 'MEMBER'
        }
      });
    }

    // Check if price exists
    const prices = await stripe.prices.list({ product: product.id, limit: 10 });
    let price = prices.data.find(p => p.unit_amount === 500 && p.recurring?.interval === 'month');

    if (!price) {
      // Create price
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 500, // $5.00
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          tier: 'MEMBER'
        }
      });
    }

    res.json({
      success: true,
      data: {
        productId: product.id,
        priceId: price.id,
        message: 'Product and price ready!',
        envUpdate: `Add this to your .env file:\nSTRIPE_PRICE_ID=${price.id}`
      }
    });
  } catch (error) {
    console.error('Stripe setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test webhook endpoint
router.post('/test-webhook', (req, res) => {
  console.log('Test webhook received:', req.body);
  res.json({ success: true, message: 'Webhook received' });
});

function getSetupInstructions() {
  return {
    steps: [
      {
        step: 1,
        title: 'Create Stripe Account',
        description: 'Go to https://dashboard.stripe.com and create a free account'
      },
      {
        step: 2,
        title: 'Get API Keys',
        description: 'Go to Developers > API Keys and copy your test keys',
        keys: ['Publishable key (pk_test_...)', 'Secret key (sk_test_...)']
      },
      {
        step: 3,
        title: 'Update .env File',
        description: 'Add your keys to backend/.env',
        example: `STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here`
      },
      {
        step: 4,
        title: 'Create Product',
        description: 'Call POST /api/stripe-setup/create-product to auto-create the membership product'
      },
      {
        step: 5,
        title: 'Set Price ID',
        description: 'Add the returned STRIPE_PRICE_ID to your .env file'
      }
    ],
    testCards: [
      { number: '4242424242424242', description: 'Successful payment' },
      { number: '4000000000000002', description: 'Card declined' },
      { number: '4000002500003155', description: 'Requires authentication' }
    ]
  };
}

export default router;
