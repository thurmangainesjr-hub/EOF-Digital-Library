/**
 * Griot AI Integration Routes
 *
 * Handles book adaptation workflows between EOF Library and Griot AI
 */

import express from 'express';
import { requireAuth, requireMember } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';
import { getGutenbergBookText } from './gutenberg.js';

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

// Most text we send to Griot in one go
const MAX_SOURCE_CHARS = 50000;

// Griot answers with sample text when it has no AI key
const DEMO_MARKER = '[Demo Mode Active]';

// Raised when Griot AI is not running or answers with an error
class GriotUnavailableError extends Error {}

async function callGriot(path, body, authorization) {
  let response;
  try {
    response = await fetch(`${GRIOT_API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization || ''
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    throw new GriotUnavailableError(`Griot AI is not running at ${GRIOT_API_URL}`);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new GriotUnavailableError(data.error || data.message || `Griot AI error ${response.status}`);
  }
  return data;
}

// The script is the last thing the Griot chain wrote
function scriptFromChain(result) {
  const outputs = { ...(result?.outputs || {}) };
  delete outputs.input;
  const values = Object.values(outputs).filter(v => typeof v === 'string');
  return values[values.length - 1] || '';
}

// Publishing a book does not give anyone adaptation rights. A user may adapt a book only when
// it is public domain, they wrote it, or the author approved their adaptation request.
async function adaptationRightsFor(user, product) {
  if (['GUTENBERG', 'PUBLIC_DOMAIN'].includes(product.source)) return 'public-domain';
  if (product.creator?.userId === user.id) return 'author';

  const approved = await prisma.adaptationRequest.findFirst({
    where: {
      userId: user.id,
      productId: product.id,
      status: { in: ['APPROVED', 'IN_PROGRESS', 'COMPLETED'] }
    }
  });
  return approved ? 'approved-request' : null;
}

// Find the book, check rights and collect its text.
// Library books use their id; Project Gutenberg books use "gutenberg-<id>".
async function loadSource(productId, user, pastedText) {
  if (productId.startsWith('gutenberg-')) {
    const gutenbergId = productId.slice('gutenberg-'.length);
    if (!/^\d+$/.test(gutenbergId)) return { error: 404, message: 'Book not found' };
    const result = await getGutenbergBookText(gutenbergId);
    if (!result) return { error: 404, message: 'This Gutenberg book has no readable text' };
    return {
      source: {
        productId: null,
        gutenbergId,
        title: result.book.title,
        author: result.book.author,
        genres: result.book.genres || [],
        description: result.book.description || ''
      },
      text: result.content,
      rights: 'public-domain'
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      creator: true,
      genres: { include: { genre: true } }
    }
  });
  if (!product) return { error: 404, message: 'Book not found' };

  const rights = await adaptationRightsFor(user, product);
  if (!rights) {
    return {
      error: 403,
      message: 'You need the author\'s approval to adapt this book. Send an adaptation request first.'
    };
  }

  let text = '';
  if (product.gutenbergId) {
    const result = await getGutenbergBookText(product.gutenbergId).catch(() => null);
    text = result?.content || '';
  }
  // Authors can paste their manuscript; there is no manuscript upload yet
  if (!text && pastedText && rights === 'author') text = pastedText;
  if (!text) text = product.description || '';

  return {
    source: {
      productId: product.id,
      gutenbergId: product.gutenbergId,
      title: product.title,
      author: product.author,
      genres: product.genres.map(g => g.genre?.name).filter(Boolean),
      description: product.description || ''
    },
    text,
    rights
  };
}

// Send a book to Griot AI and get a draft script (or other adaptation) back
router.post('/export/:productId', requireMember, async (req, res) => {
  try {
    const { productId } = req.params;
    const { adaptationType = 'screenplay', options = {}, text: pastedText } = req.body;

    const loaded = await loadSource(productId, req.user, pastedText);
    if (loaded.error) {
      return res.status(loaded.error).json({ success: false, error: loaded.message });
    }
    const { source, text, rights } = loaded;

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'This book has no text yet. Paste the manuscript text to adapt it.'
      });
    }
    const content = text.substring(0, MAX_SOURCE_CHARS);

    // 1. Book in: create a Griot project for this book
    const project = await callGriot('/api/projects/import-book', {
      title: `${source.title} - ${adaptationType} Adaptation`,
      sourceBook: {
        id: source.productId || `gutenberg-${source.gutenbergId}`,
        title: source.title,
        author: source.author,
        description: source.description,
        genres: source.genres,
        gutenbergId: source.gutenbergId,
        content
      },
      adaptationType,
      options,
      canon: {
        projectTitle: source.title,
        genre: source.genres[0] || 'Fiction',
        sourceType: 'book',
        originalAuthor: source.author
      }
    }, req.headers.authorization);

    // 2. Script out: run Griot's adaptation chain on the text
    const chain = await callGriot('/api/chains/adapt', {
      content,
      adaptationType,
      bookTitle: source.title,
      author: source.author
    }, req.headers.authorization);

    const scriptText = scriptFromChain(chain.data);
    const isDemo = scriptText.includes(DEMO_MARKER);

    const adaptation = await prisma.adaptation.create({
      data: {
        userId: req.user.id,
        productId: source.productId,
        gutenbergId: source.gutenbergId,
        sourceTitle: source.title,
        sourceAuthor: source.author,
        type: adaptationType,
        isDemo,
        griotProjectId: project.projectId,
        scriptText,
        metadata: JSON.stringify({ options, rights, sourceChars: content.length })
      }
    });

    res.json({
      success: true,
      data: {
        adaptationId: adaptation.id,
        projectId: project.projectId,
        griotUrl: `${process.env.GRIOT_FRONTEND_URL || 'http://localhost:5173'}/workspace/${project.projectId}`,
        script: scriptText,
        status: adaptation.status,
        isDemo,
        message: isDemo
          ? 'Griot AI has no AI key set, so this is sample text, not a real script'
          : 'Draft script ready for the author to review'
      }
    });
  } catch (error) {
    if (error instanceof GriotUnavailableError) {
      return res.status(503).json({ success: false, error: error.message });
    }
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

    // The list leaves out the script text; open one adaptation to read it
    res.json({
      success: true,
      data: { adaptations: adaptations.map(({ scriptText, ...rest }) => rest) }
    });
  } catch (error) {
    console.error('Get adaptations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get adaptations'
    });
  }
});

// Read one adaptation, including its script
router.get('/adaptations/:id', requireAuth, async (req, res) => {
  try {
    const adaptation = await prisma.adaptation.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!adaptation) {
      return res.status(404).json({ success: false, error: 'Adaptation not found' });
    }
    res.json({ success: true, data: { adaptation } });
  } catch (error) {
    console.error('Get adaptation error:', error);
    res.status(500).json({ success: false, error: 'Failed to get adaptation' });
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
