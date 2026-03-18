/**
 * Adaptation Routes
 *
 * Handles adaptation rights and Griot AI integration
 */

import express from 'express';
import { requireAuth, requireMember, requireCreator } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

const GRIOT_API_URL = process.env.GRIOT_API_URL || 'http://localhost:3001';

// Get adaptation preferences
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    let prefs = await prisma.adaptationPreference.findFirst({
      where: { userId: req.user.id }
    });

    if (!prefs) {
      prefs = await prisma.adaptationPreference.create({
        data: {
          id: uuidv4(),
          userId: req.user.id,
          preferredFormat: 'film'
        }
      });
    }

    res.json({ success: true, data: { preferences: prefs } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get preferences' });
  }
});

// Update preferences
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const prefs = await prisma.adaptationPreference.upsert({
      where: { id: req.body.id || 'new' },
      update: req.body,
      create: {
        id: uuidv4(),
        userId: req.user.id,
        ...req.body
      }
    });

    res.json({ success: true, data: { preferences: prefs } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update preferences' });
  }
});

// Request adaptation rights
router.post('/request', requireMember, async (req, res) => {
  try {
    const { productId, targetFormat, notes } = req.body;

    // Get product and check adaptation is allowed
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { creator: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (!product.adaptationAllowed) {
      return res.status(400).json({
        success: false,
        error: 'Adaptation not allowed for this product'
      });
    }

    // Check for existing request
    const existing = await prisma.adaptationRequest.findFirst({
      where: {
        userId: req.user.id,
        productId,
        status: { in: ['PENDING', 'APPROVED', 'IN_PROGRESS'] }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active request for this product'
      });
    }

    // Create request
    const request = await prisma.adaptationRequest.create({
      data: {
        id: uuidv4(),
        userId: req.user.id,
        productId,
        targetFormat,
        notes,
        feeAmount: product.adaptationFee
      },
      include: {
        product: { select: { title: true } },
        user: { select: { name: true, email: true } }
      }
    });

    res.status(201).json({
      success: true,
      data: {
        request,
        message: product.adaptationFee
          ? `Request submitted. Fee: $${product.adaptationFee}`
          : 'Request submitted for creator review'
      }
    });
  } catch (error) {
    console.error('Adaptation request error:', error);
    res.status(500).json({ success: false, error: 'Failed to create request' });
  }
});

// List user's requests
router.get('/requests', requireAuth, async (req, res) => {
  try {
    const requests = await prisma.adaptationRequest.findMany({
      where: { userId: req.user.id },
      include: {
        product: { select: { title: true, coverImage: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: { requests } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
});

// Creator: Approve/deny request
router.put('/requests/:id', requireCreator, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    // Verify creator owns the product
    const request = await prisma.adaptationRequest.findUnique({
      where: { id: req.params.id },
      include: { product: true }
    });

    if (!request || request.product.creatorId !== req.user.creatorProfileId) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const updated = await prisma.adaptationRequest.update({
      where: { id: req.params.id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.user.id,
        reviewNotes
      }
    });

    res.json({ success: true, data: { request: updated } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update request' });
  }
});

// Export to Griot AI
router.post('/export-to-griot', requireMember, async (req, res) => {
  try {
    const { adaptationRequestId, griotProjectType, includeCharacters, includeWorldBuilding } = req.body;

    // Get approved request
    const request = await prisma.adaptationRequest.findFirst({
      where: {
        id: adaptationRequestId,
        userId: req.user.id,
        status: 'APPROVED'
      },
      include: {
        product: {
          include: {
            creator: true
          }
        }
      }
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Approved adaptation request not found'
      });
    }

    // Create project in Griot AI
    const griotResponse = await fetch(`${GRIOT_API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GRIOT_API_KEY}`
      },
      body: JSON.stringify({
        type: griotProjectType || request.targetFormat,
        canon: {
          projectTitle: `Adaptation: ${request.product.title}`,
          genre: 'adaptation',
          sourceWork: {
            title: request.product.title,
            creator: request.product.creator.displayName,
            eofProductId: request.product.id,
            eofRequestId: request.id
          }
        },
        characters: includeCharacters ? [] : undefined, // Would extract from product
        importedFrom: 'eof-digital-library'
      })
    });

    if (!griotResponse.ok) {
      throw new Error('Failed to create Griot AI project');
    }

    const griotProject = await griotResponse.json();

    // Update request with Griot project ID
    await prisma.adaptationRequest.update({
      where: { id: request.id },
      data: {
        status: 'IN_PROGRESS',
        griotProjectId: griotProject.id,
        griotExportUrl: `${process.env.GRIOT_FRONTEND_URL || 'http://localhost:5173'}/project/${griotProject.id}`
      }
    });

    res.json({
      success: true,
      data: {
        griotProjectId: griotProject.id,
        griotProjectUrl: `${process.env.GRIOT_FRONTEND_URL || 'http://localhost:5173'}/project/${griotProject.id}`,
        exportedElements: {
          sourceWork: true,
          characters: includeCharacters,
          worldBuilding: includeWorldBuilding
        }
      }
    });
  } catch (error) {
    console.error('Griot export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export to Griot AI'
    });
  }
});

export default router;
