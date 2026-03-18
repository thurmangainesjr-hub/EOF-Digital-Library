/**
 * Genre Routes
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// List all genres
router.get('/', async (req, res) => {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        children: true,
        _count: { select: { products: true } }
      },
      where: { parentId: null }
    });

    res.json({
      success: true,
      data: { genres }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genres'
    });
  }
});

// Get genre with products
router.get('/:slug', async (req, res) => {
  try {
    const genre = await prisma.genre.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                creator: { select: { displayName: true } }
              }
            }
          },
          where: { product: { status: 'PUBLISHED' } },
          take: 20
        }
      }
    });

    if (!genre) {
      return res.status(404).json({
        success: false,
        error: 'Genre not found'
      });
    }

    res.json({
      success: true,
      data: { genre }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genre'
    });
  }
});

export default router;
