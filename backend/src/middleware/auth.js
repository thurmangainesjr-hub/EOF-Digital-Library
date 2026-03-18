/**
 * Authentication Middleware
 */

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'eof-dev-secret';

// Require authentication
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'UNAUTHORIZED'
    });
  }
}

// Optional authentication
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Invalid token, continue without user
    }
  }

  next();
}

// Require membership
export function requireMember(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.membershipTier || req.user.membershipTier === 'FREE') {
      return res.status(403).json({
        success: false,
        error: 'Membership required',
        code: 'MEMBERSHIP_REQUIRED'
      });
    }
    next();
  });
}

// Require creator role
export async function requireCreator(req, res, next) {
  requireAuth(req, res, async () => {
    if (req.user.role !== 'CREATOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Creator access required',
        code: 'FORBIDDEN'
      });
    }

    // Get creator profile ID
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(403).json({
        success: false,
        error: 'Creator profile required',
        code: 'FORBIDDEN'
      });
    }

    req.user.creatorProfileId = profile.id;
    next();
  });
}

// Require admin role
export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
        code: 'FORBIDDEN'
      });
    }
    next();
  });
}

export default {
  requireAuth,
  optionalAuth,
  requireMember,
  requireCreator,
  requireAdmin
};
