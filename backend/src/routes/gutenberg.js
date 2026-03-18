/**
 * Gutenberg API Routes
 *
 * Proxies requests to Project Gutenberg API (gutendex.com)
 * Provides access to 70,000+ free public domain books
 */

import express from 'express';

const router = express.Router();
const GUTENDEX_API = 'https://gutendex.com';

// Cache for API responses (simple in-memory cache)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Gutenberg API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

// Search books
router.get('/books', async (req, res) => {
  try {
    const { search, topic, author, language, page, ids } = req.query;

    // Build query string
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (topic) params.append('topic', topic);
    if (author) params.append('author', author);
    if (language) params.append('languages', language || 'en');
    if (page) params.append('page', page);
    if (ids) params.append('ids', ids);

    // Default to English if no language specified
    if (!language && !ids) {
      params.append('languages', 'en');
    }

    const url = `${GUTENDEX_API}/books?${params.toString()}`;
    const data = await fetchWithCache(url);

    // Transform response for our frontend
    const books = data.results.map(transformBook);

    res.json({
      success: true,
      data: {
        books,
        count: data.count,
        next: data.next,
        previous: data.previous
      }
    });
  } catch (error) {
    console.error('Gutenberg search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books from Project Gutenberg'
    });
  }
});

// Get single book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `${GUTENDEX_API}/books/${id}`;
    const book = await fetchWithCache(url);

    res.json({
      success: true,
      data: { book: transformBook(book) }
    });
  } catch (error) {
    console.error('Gutenberg book error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book from Project Gutenberg'
    });
  }
});

// Get book content (text)
router.get('/books/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;

    // First get book metadata
    const url = `${GUTENDEX_API}/books/${id}`;
    const book = await fetchWithCache(url);

    // Find the best text format
    const formats = book.formats || {};
    let contentUrl = null;

    // Priority: plain text UTF-8 > plain text > HTML
    const preferredFormats = [
      'text/plain; charset=utf-8',
      'text/plain; charset=us-ascii',
      'text/plain',
      'text/html; charset=utf-8',
      'text/html'
    ];

    if (format && formats[format]) {
      contentUrl = formats[format];
    } else {
      for (const fmt of preferredFormats) {
        if (formats[fmt]) {
          contentUrl = formats[fmt];
          break;
        }
      }
    }

    if (!contentUrl) {
      return res.status(404).json({
        success: false,
        error: 'No readable content format available'
      });
    }

    // Fetch the content
    const contentResponse = await fetch(contentUrl);
    if (!contentResponse.ok) {
      throw new Error('Failed to fetch content');
    }

    const content = await contentResponse.text();

    // Clean up the content (remove Gutenberg headers/footers for reading)
    const cleanedContent = cleanGutenbergText(content);

    res.json({
      success: true,
      data: {
        book: transformBook(book),
        content: cleanedContent,
        format: contentUrl.includes('html') ? 'html' : 'text',
        sourceUrl: contentUrl
      }
    });
  } catch (error) {
    console.error('Gutenberg content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book content'
    });
  }
});

// Get popular/featured books
router.get('/popular', async (req, res) => {
  try {
    // Get most downloaded books
    const url = `${GUTENDEX_API}/books?sort=popular&languages=en`;
    const data = await fetchWithCache(url);

    const books = data.results.map(transformBook);

    res.json({
      success: true,
      data: { books }
    });
  } catch (error) {
    console.error('Gutenberg popular error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular books'
    });
  }
});

// Get books by topic/category
router.get('/topics/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { page } = req.query;

    const params = new URLSearchParams({
      topic: topic,
      languages: 'en'
    });
    if (page) params.append('page', page);

    const url = `${GUTENDEX_API}/books?${params.toString()}`;
    const data = await fetchWithCache(url);

    const books = data.results.map(transformBook);

    res.json({
      success: true,
      data: {
        books,
        count: data.count,
        next: data.next,
        previous: data.previous
      }
    });
  } catch (error) {
    console.error('Gutenberg topic error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books by topic'
    });
  }
});

// Transform Gutenberg book to our format
function transformBook(book) {
  // Get primary author
  const authors = book.authors || [];
  const primaryAuthor = authors[0] || { name: 'Unknown Author' };

  // Get cover image
  const formats = book.formats || {};
  const coverImage = formats['image/jpeg'] || null;

  // Get subjects as genres
  const subjects = book.subjects || [];
  const bookshelves = book.bookshelves || [];

  // Extract year from author birth/death if available
  let publicationYear = null;
  if (primaryAuthor.birth_year) {
    // Estimate publication as when author was 30-50
    publicationYear = primaryAuthor.birth_year + 40;
  }

  return {
    id: book.id,
    gutenbergId: book.id,
    title: book.title || 'Untitled',
    author: primaryAuthor.name,
    authorBirth: primaryAuthor.birth_year,
    authorDeath: primaryAuthor.death_year,
    authors: authors.map(a => a.name),
    coverImage,
    description: subjects.slice(0, 3).join('. '),
    subjects,
    bookshelves,
    languages: book.languages || ['en'],
    downloadCount: book.download_count || 0,
    formats: Object.keys(formats),
    hasText: !!(formats['text/plain'] || formats['text/plain; charset=utf-8']),
    hasHtml: !!(formats['text/html'] || formats['text/html; charset=utf-8']),
    hasEpub: !!formats['application/epub+zip'],
    publicDomain: true,
    adaptationAllowed: true,
    price: 0
  };
}

// Clean Gutenberg text (remove headers/footers)
function cleanGutenbergText(text) {
  // Find start of actual content (after Gutenberg header)
  const startMarkers = [
    '*** START OF THE PROJECT GUTENBERG EBOOK',
    '*** START OF THIS PROJECT GUTENBERG EBOOK',
    '*END*THE SMALL PRINT',
    'Produced by'
  ];

  const endMarkers = [
    '*** END OF THE PROJECT GUTENBERG EBOOK',
    '*** END OF THIS PROJECT GUTENBERG EBOOK',
    'End of the Project Gutenberg EBook',
    'End of Project Gutenberg'
  ];

  let content = text;

  // Find and remove header
  for (const marker of startMarkers) {
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      // Find the next line break after the marker
      const lineEnd = content.indexOf('\n', idx);
      if (lineEnd !== -1) {
        content = content.substring(lineEnd + 1);
      }
      break;
    }
  }

  // Find and remove footer
  for (const marker of endMarkers) {
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      content = content.substring(0, idx);
      break;
    }
  }

  // Trim whitespace
  content = content.trim();

  return content;
}

export default router;
