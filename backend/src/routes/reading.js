/**
 * Reading Session Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get reading history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const sessions = await prisma.readingSession.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { lastReadAt: 'desc' },
      take: 20
    });

    res.json({ success: true, data: { sessions } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// Get session for product
router.get('/:productId', requireAuth, async (req, res) => {
  try {
    let session = await prisma.readingSession.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId
        }
      }
    });

    if (!session) {
      session = await prisma.readingSession.create({
        data: {
          userId: req.user.id,
          productId: req.params.productId
        }
      });
    }

    res.json({ success: true, data: { session } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get session' });
  }
});

// Update reading progress
router.put('/:productId', requireAuth, async (req, res) => {
  try {
    const { currentPage, totalPages, totalReadTime } = req.body;

    const percentComplete = totalPages ? (currentPage / totalPages) * 100 : 0;

    const session = await prisma.readingSession.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId
        }
      },
      update: {
        currentPage,
        totalPages,
        percentComplete,
        totalReadTime: { increment: totalReadTime || 0 },
        lastReadAt: new Date(),
        finishedAt: percentComplete >= 100 ? new Date() : null
      },
      create: {
        userId: req.user.id,
        productId: req.params.productId,
        currentPage,
        totalPages,
        percentComplete
      }
    });

    res.json({ success: true, data: { session } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
});

// Add bookmark
router.post('/:productId/bookmark', requireAuth, async (req, res) => {
  try {
    const { page, note } = req.body;

    const session = await prisma.readingSession.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId
        }
      }
    });

    const bookmarks = session?.bookmarks || [];
    bookmarks.push({ page, note, createdAt: new Date().toISOString() });

    const updated = await prisma.readingSession.update({
      where: { id: session.id },
      data: { bookmarks }
    });

    res.json({ success: true, data: { session: updated } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add bookmark' });
  }
});

export default router;
