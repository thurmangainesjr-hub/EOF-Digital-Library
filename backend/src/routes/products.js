/**
 * Product Routes
 */

import express from 'express';
import { requireAuth, optionalAuth, requireCreator } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const [totalBooks, creators, adaptations] = await Promise.all([
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.creatorProfile.count({ where: { verified: true } }),
      prisma.adaptationRequest.count()
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        creators,
        adaptations,
        griotProjects: adaptations
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: { totalBooks: 0, creators: 0, adaptations: 0, griotProjects: 0 }
    });
  }
});

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
          { title: { contains: search } },
          { description: { contains: search } }
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

// Get product by ID or slug
router.get('/:idOrSlug', optionalAuth, async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id: idOrSlug },
      include: {
        creator: { select: { id: true, displayName: true, bio: true } },
        genres: { include: { genre: true } },
        files: { where: { isPrimary: true } }
      }
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: idOrSlug },
        include: {
          creator: { select: { id: true, displayName: true, bio: true } },
          genres: { include: { genre: true } },
          files: { where: { isPrimary: true } }
        }
      });
    }

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
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// Get product content for reader
router.get('/:id/content', optionalAuth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Return sample content (in production, fetch from file storage)
    const sampleText = `${product.title}\nby ${product.author}\n\n${product.description || ''}\n\nThis is a preview of the book content. In a production environment, the full text would be loaded from secure storage.\n\nChapter 1\n\nThe story begins here with compelling narrative and rich character development. The author masterfully weaves together themes of love, loss, and redemption.\n\nAs the sun set over the horizon, casting long shadows across the landscape, our protagonist contemplated the journey ahead. Little did they know that this moment would mark the beginning of an extraordinary adventure.\n\n[Content continues...]`;

    res.json({
      success: true,
      data: {
        text: sampleText,
        pages: sampleText.split('\n\n').filter(p => p.trim())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load content'
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
