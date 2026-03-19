/**
 * Griot AI Integration Routes
 *
 * Handles book adaptation workflows between EOF Library and Griot AI
 */

import express from 'express';
import { requireAuth, requireMember } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

const GRIOT_API_URL = process.env.GRIOT_API_URL || 'http://localhost:3001';

// Check Griot AI connection status
router.get('/status', async (req, res) => {
  try {
    const response = await fetch(`${GRIOT_API_URL}/health`, {
      method: 'GET',
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      res.json({
        success: true,
        data: {
          connected: true,
          griotStatus: data,
          url: GRIOT_API_URL
        }
      });
    } else {
      throw new Error('Griot AI not responding');
    }
  } catch (error) {
    res.json({
      success: true,
      data: {
        connected: false,
        error: error.message,
        url: GRIOT_API_URL,
        instructions: 'Start Griot AI server: cd griot-ai/server && npm run dev'
      }
    });
  }
});

// Export book to Griot AI for adaptation
router.post('/export/:productId', requireMember, async (req, res) => {
  try {
    const { productId } = req.params;
    const { adaptationType, options = {} } = req.body;

    // Get book details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        genres: {
          include: { genre: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Get book content if available
    let content = '';
    if (product.gutenbergId) {
      // Fetch from Gutenberg
      try {
        const gutenbergRes = await fetch(
          `${req.protocol}://${req.get('host')}/api/gutenberg/books/${product.gutenbergId}/content`
        );
        if (gutenbergRes.ok) {
          const gutenbergData = await gutenbergRes.json();
          content = gutenbergData.data?.content || '';
        }
      } catch (e) {
        console.log('Could not fetch Gutenberg content:', e.message);
      }
    }

    // Create project data for Griot AI
    const projectData = {
      title: `${product.title} - ${adaptationType} Adaptation`,
      sourceBook: {
        id: product.id,
        title: product.title,
        author: product.author,
        description: product.description,
        genres: product.genres.map(g => g.genre?.name || g.name),
        gutenbergId: product.gutenbergId,
        content: content.substring(0, 50000) // Limit content size
      },
      adaptationType,
      options,
      canon: {
        projectTitle: product.title,
        genre: product.genres[0]?.genre?.name || 'Fiction',
        sourceType: 'book',
        originalAuthor: product.author
      }
    };

    // Send to Griot AI
    const griotResponse = await fetch(`${GRIOT_API_URL}/api/projects/import-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify(projectData)
    });

    if (!griotResponse.ok) {
      const error = await griotResponse.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Failed to export to Griot AI');
    }

    const griotData = await griotResponse.json();

    // Record the adaptation in our database
    await prisma.adaptation.create({
      data: {
        productId: product.id,
        userId: req.user.id,
        griotProjectId: griotData.projectId,
        type: adaptationType,
        status: 'IN_PROGRESS',
        metadata: JSON.stringify(options)
      }
    });

    res.json({
      success: true,
      data: {
        projectId: griotData.projectId,
        griotUrl: `${process.env.GRIOT_FRONTEND_URL || 'http://localhost:5173'}/workspace/${griotData.projectId}`,
        message: 'Book exported to Griot AI successfully'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export book'
    });
  }
});

// Get adaptation types available
router.get('/adaptation-types', (req, res) => {
  res.json({
    success: true,
    data: {
      types: [
        {
          id: 'audiobook',
          name: 'Audiobook',
          description: 'Full narrated audiobook with voice acting',
          icon: '🎧',
          features: ['AI narration', 'Character voices', 'Sound effects', 'Music scoring']
        },
        {
          id: 'screenplay',
          name: 'Screenplay',
          description: 'Film or TV screenplay adaptation',
          icon: '🎬',
          features: ['Scene breakdown', 'Dialogue', 'Stage directions', 'Format options']
        },
        {
          id: 'game-narrative',
          name: 'Game Narrative',
          description: 'Interactive game story adaptation',
          icon: '🎮',
          features: ['Branching paths', 'Character dialogue', 'Quest structure', 'World building']
        },
        {
          id: 'podcast',
          name: 'Podcast Series',
          description: 'Episodic podcast dramatization',
          icon: '🎙️',
          features: ['Episode structure', 'Narration', 'Sound design', 'Serialization']
        },
        {
          id: 'graphic-novel',
          name: 'Graphic Novel',
          description: 'Visual comic/manga adaptation',
          icon: '📚',
          features: ['Panel layout', 'Character designs', 'Scene visualization', 'Dialogue bubbles']
        }
      ]
    }
  });
});

// Get user's adaptations
router.get('/my-adaptations', requireAuth, async (req, res) => {
  try {
    const adaptations = await prisma.adaptation.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { adaptations }
    });
  } catch (error) {
    console.error('Get adaptations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get adaptations'
    });
  }
});

// Quick adaptation (demo mode - doesn't require Griot connection)
router.post('/quick-adapt/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { type, prompt } = req.body;

    // Get book
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Generate quick adaptation preview
    const previews = {
      audiobook: `🎧 AUDIOBOOK PREVIEW: "${product.title}"

NARRATOR: In a world where stories come alive through sound...

[Dramatic music fades in]

Chapter One begins with ${product.author}'s masterful opening,
bringing readers into a realm of imagination and wonder.

[Voice shifts to character]

The protagonist speaks: "This is just the beginning..."

---
[Demo Preview - Export to Griot AI for full adaptation]`,

      screenplay: `🎬 SCREENPLAY PREVIEW: "${product.title}"

FADE IN:

INT. ${product.title.toUpperCase()} - DAY

Based on the novel by ${product.author}

The camera slowly reveals our setting,
establishing the world that readers have loved.

PROTAGONIST
(looking determined)
Every great story deserves to be seen.

---
[Demo Preview - Export to Griot AI for full adaptation]`,

      summary: `📝 ADAPTATION SUMMARY: "${product.title}"

Original Work: ${product.title} by ${product.author}
Genre: ${product.genres || 'Fiction'}

This adaptation would preserve the core themes while
translating the narrative into a new medium.

Key adaptation considerations:
- Maintain character authenticity
- Preserve emotional beats
- Adapt pacing for new format

---
[Demo Preview - Export to Griot AI for full adaptation]`
    };

    const preview = previews[type] || previews.summary;

    res.json({
      success: true,
      data: {
        preview,
        type,
        book: {
          id: product.id,
          title: product.title,
          author: product.author
        },
        isDemo: true
      }
    });
  } catch (error) {
    console.error('Quick adapt error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview'
    });
  }
});

export default router;
