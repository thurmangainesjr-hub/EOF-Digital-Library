/**
 * Creator Routes
 */

import express from 'express';
import { requireAuth, requireCreator } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// List verified creators
router.get('/', async (req, res) => {
  try {
    const creators = await prisma.creatorProfile.findMany({
      where: { verified: true },
      include: {
        _count: { select: { products: true } },
        user: { select: { name: true } }
      },
      orderBy: { totalSales: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: { creators }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch creators' });
  }
});

// Get creator profile
router.get('/:id', async (req, res) => {
  try {
    const creator = await prisma.creatorProfile.findUnique({
      where: { id: req.params.id },
      include: {
        products: {
          where: { status: 'PUBLISHED' },
          take: 10,
          orderBy: { publishedAt: 'desc' }
        }
      }
    });

    if (!creator) {
      return res.status(404).json({ success: false, error: 'Creator not found' });
    }

    res.json({ success: true, data: { creator } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch creator' });
  }
});

// Create creator profile
router.post('/profile', requireAuth, async (req, res) => {
  try {
    const { displayName, bio, website, socialLinks } = req.body;

    const profile = await prisma.creatorProfile.create({
      data: {
        userId: req.user.id,
        displayName: displayName || req.user.name,
        bio,
        website,
        socialLinks
      }
    });

    // Update user role
    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'CREATOR' }
    });

    res.status(201).json({ success: true, data: { profile } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create profile' });
  }
});

// Update creator profile
router.put('/profile', requireCreator, async (req, res) => {
  try {
    const profile = await prisma.creatorProfile.update({
      where: { userId: req.user.id },
      data: req.body
    });

    res.json({ success: true, data: { profile } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Get earnings
router.get('/earnings', requireCreator, async (req, res) => {
  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: req.user.id }
    });

    const recentOrders = await prisma.order.findMany({
      where: {
        product: { creatorId: profile.id },
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        totalEarnings: profile.totalEarnings,
        totalSales: profile.totalSales,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch earnings' });
  }
});

export default router;
