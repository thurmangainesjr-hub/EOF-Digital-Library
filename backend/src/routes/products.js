/**
 * Product Routes
 */

import express from 'express';
import { requireAuth, optionalAuth, requireCreator } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// List/search products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { genre, search, source, page = 1, limit = 20 } = req.query;

    const where = {
      status: 'PUBLISHED',
      ...(genre && { genres: { some: { genre: { slug: genre } } } }),
      ...(source && { source }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        creator: { select: { displayName: true } },
        genres: { include: { genre: true } }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { publishedAt: 'desc' }
    });

    const total = await prisma.product.count({ where });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Get product by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        creator: { select: { id: true, displayName: true, bio: true } },
        genres: { include: { genre: true } },
        files: { where: { isPrimary: true } }
      }
    });

    if (!product || product.status !== 'PUBLISHED') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Create product (creator only)
router.post('/', requireCreator, async (req, res) => {
  try {
    const { title, description, type, price, genres, adaptationAllowed, adaptationTerms, adaptationFee } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        description,
        type: type || 'EBOOK',
        price: price || 0,
        isFree: !price || price === 0,
        creatorId: req.user.creatorProfileId,
        adaptationAllowed: adaptationAllowed || false,
        adaptationTerms,
        adaptationFee,
        genres: {
          create: genres?.map(genreId => ({
            genre: { connect: { id: genreId } }
          })) || []
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

// Update product
router.put('/:id', requireCreator, async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        creatorId: req.user.creatorProfileId
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: req.body
    });

    res.json({
      success: true,
      data: { product: updated }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:id', requireCreator, async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
        creatorId: req.user.creatorProfileId
      }
    });

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

// Download product file (members only)
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    // Check membership
    if (req.user.membershipTier === 'FREE') {
      return res.status(403).json({
        success: false,
        error: 'Membership required',
        code: 'MEMBERSHIP_REQUIRED'
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { files: { where: { isPrimary: true } } }
    });

    if (!product || !product.files[0]) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Increment download count
    await prisma.product.update({
      where: { id: product.id },
      data: { downloadCount: { increment: 1 } }
    });

    res.json({
      success: true,
      data: {
        downloadUrl: product.files[0].fileUrl,
        filename: product.files[0].filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Download failed'
    });
  }
});

export default router;
