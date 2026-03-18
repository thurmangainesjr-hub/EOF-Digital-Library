/**
 * Bookshelf Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

// List user's bookshelves
router.get('/', requireAuth, async (req, res) => {
  try {
    const bookshelves = await prisma.bookshelf.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
          take: 5
        },
        _count: { select: { items: true } }
      }
    });

    res.json({ success: true, data: { bookshelves } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookshelves' });
  }
});

// Create bookshelf
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const bookshelf = await prisma.bookshelf.create({
      data: {
        id: uuidv4(),
        userId: req.user.id,
        name,
        description,
        isPublic: isPublic || false
      }
    });

    res.status(201).json({ success: true, data: { bookshelf } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create bookshelf' });
  }
});

// Add product to bookshelf
router.post('/:id/items', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    const bookshelf = await prisma.bookshelf.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!bookshelf) {
      return res.status(404).json({ success: false, error: 'Bookshelf not found' });
    }

    const item = await prisma.bookshelfItem.create({
      data: {
        id: uuidv4(),
        bookshelfId: bookshelf.id,
        productId
      },
      include: { product: true }
    });

    res.status(201).json({ success: true, data: { item } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add item' });
  }
});

// Delete bookshelf
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.bookshelf.delete({
      where: { id: req.params.id, userId: req.user.id }
    });

    res.json({ success: true, message: 'Bookshelf deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete bookshelf' });
  }
});

export default router;
