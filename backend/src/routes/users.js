/**
 * User Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// Update current user
router.put('/me', requireAuth, async (req, res) => {
  // TODO: Implement user update
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// Delete account
router.delete('/me', requireAuth, async (req, res) => {
  // TODO: Implement account deletion
  res.json({
    success: true,
    message: 'Account deleted'
  });
});

export default router;
