/**
 * Creator Community Routes
 *
 * Handles chat room and adaptation voting for creators
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

// In-memory storage for demo (use database in production)
const chatMessages = [];
const adaptationVotes = new Map();

// Middleware to check if user is a creator
const requireCreator = async (req, res, next) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: { userId: req.user.id }
    });

    if (!membership || membership.tier !== 'CREATOR') {
      return res.status(403).json({
        success: false,
        error: 'Creator access required'
      });
    }

    next();
  } catch (error) {
    // Allow through for demo purposes
    next();
  }
};

// =====================================
// CHAT ROUTES
// =====================================

// Get chat messages
router.get('/chat', requireAuth, async (req, res) => {
  try {
    // Return recent messages (last 50)
    const messages = chatMessages.slice(-50);

    res.json({
      success: true,
      data: {
        messages,
        count: messages.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send chat message
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const newMessage = {
      id: Date.now().toString(),
      user: {
        id: req.user.id,
        name: req.user.name || 'Creator',
        badge: 'creator'
      },
      text: message.trim(),
      timestamp: new Date().toISOString()
    };

    chatMessages.push(newMessage);

    // Keep only last 100 messages
    if (chatMessages.length > 100) {
      chatMessages.shift();
    }

    res.json({
      success: true,
      data: { message: newMessage }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================
// ADAPTATION LIST ROUTES
// =====================================

// Get adaptations for voting
router.get('/adaptations', requireAuth, async (req, res) => {
  try {
    const { type } = req.query;

    // Get products that are good candidates for adaptation
    let products = [];

    try {
      products = await prisma.product.findMany({
        where: {
          publicDomain: true,
          ...(type && type !== 'all' ? {} : {})
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
    } catch (e) {
      // Database not available, return demo data
      products = [];
    }

    // Add vote counts
    const adaptations = products.map(product => ({
      id: product.id,
      title: product.title,
      author: product.author,
      description: product.description,
      coverImage: product.coverImage,
      votes: adaptationVotes.get(product.id) || Math.floor(Math.random() * 100),
      adaptationType: type !== 'all' ? type : ['audiobook', 'screenplay'][Math.floor(Math.random() * 2)],
      status: Math.random() > 0.7 ? 'high_demand' : 'trending',
      nominatedBy: 'Creator_' + ['Maya', 'James', 'Aisha', 'Devon'][Math.floor(Math.random() * 4)],
      nominatedAt: new Date().toISOString()
    }));

    // Sort by votes
    adaptations.sort((a, b) => b.votes - a.votes);

    res.json({
      success: true,
      data: { adaptations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vote on an adaptation
router.post('/adaptations/:bookId/vote', requireAuth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { direction } = req.body; // 'up' or 'down'

    const currentVotes = adaptationVotes.get(bookId) || 50;
    const newVotes = direction === 'up' ? currentVotes + 1 : Math.max(0, currentVotes - 1);

    adaptationVotes.set(bookId, newVotes);

    res.json({
      success: true,
      data: {
        bookId,
        votes: newVotes,
        direction
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Nominate a book for adaptation
router.post('/adaptations/nominate', requireAuth, async (req, res) => {
  try {
    const { bookId, adaptationType, reason } = req.body;

    if (!bookId || !adaptationType) {
      return res.status(400).json({
        success: false,
        error: 'Book ID and adaptation type are required'
      });
    }

    // In production, save to database
    const nomination = {
      id: Date.now().toString(),
      bookId,
      adaptationType,
      reason,
      nominatedBy: req.user.id,
      nominatedAt: new Date().toISOString(),
      votes: 1
    };

    adaptationVotes.set(bookId, 1);

    res.json({
      success: true,
      data: { nomination }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get online creators (simplified)
router.get('/online', requireAuth, async (req, res) => {
  try {
    // In production, track actual online status
    const onlineCreators = [
      { id: '1', name: 'Maya Johnson', badge: 'creator' },
      { id: '2', name: 'James Williams', badge: 'creator' },
      { id: '3', name: 'Aisha Thompson', badge: 'top_creator' },
      { id: '4', name: 'Devon Carter', badge: 'creator' }
    ];

    res.json({
      success: true,
      data: { creators: onlineCreators }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
