/**
 * Admin Routes
 */

import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get pending products
router.get('/products/pending', requireAdmin, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        creator: { select: { displayName: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Review product
router.put('/products/:id/review', requireAdmin, async (req, res) => {
  try {
    const { action, notes } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        status: action === 'APPROVED' ? 'PUBLISHED' : 'REJECTED',
        publishedAt: action === 'APPROVED' ? new Date() : null
      }
    });

    // Log admin action
    await prisma.adminReview.create({
      data: {
        entityType: 'product',
        entityId: product.id,
        reviewerId: req.user.id,
        action,
        notes
      }
    });

    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to review product' });
  }
});

// Get pending creators
router.get('/creators/pending', requireAdmin, async (req, res) => {
  try {
    const creators = await prisma.creatorProfile.findMany({
      where: { verified: false },
      include: {
        user: { select: { email: true, createdAt: true } }
      }
    });

    res.json({ success: true, data: { creators } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch creators' });
  }
});

// Verify creator
router.put('/creators/:id/verify', requireAdmin, async (req, res) => {
  try {
    const { verified, notes } = req.body;

    const creator = await prisma.creatorProfile.update({
      where: { id: req.params.id },
      data: {
        verified,
        verifiedAt: verified ? new Date() : null
      }
    });

    await prisma.adminReview.create({
      data: {
        entityType: 'creator',
        entityId: creator.id,
        reviewerId: req.user.id,
        action: verified ? 'APPROVED' : 'REJECTED',
        notes
      }
    });

    res.json({ success: true, data: { creator } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify creator' });
  }
});

export default router;
