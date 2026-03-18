/**
 * EOF Digital Library - API Server
 *
 * Main entry point for the backend services
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import membershipRoutes from './routes/memberships.js';
import productRoutes from './routes/products.js';
import genreRoutes from './routes/genres.js';
import creatorRoutes from './routes/creators.js';
import bookshelfRoutes from './routes/bookshelves.js';
import readingRoutes from './routes/reading.js';
import adaptationRoutes from './routes/adaptations.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimit } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use(apiRateLimit);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'eof-digital-library-api',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'eof-digital-library-api',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Database health check
import prisma from './lib/prisma.js';

app.get('/api/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/products', productRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/bookshelves', bookshelfRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/adaptations', adaptationRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     EOF DIGITAL LIBRARY API                  ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  API:     http://localhost:${PORT}/api           ║`);
  console.log(`║  Health:  http://localhost:${PORT}/health        ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});

export default app;
