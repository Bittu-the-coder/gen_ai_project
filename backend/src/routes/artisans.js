import express from 'express';
import { query, validationResult } from 'express-validator';
import initializeFirebase, { getFirestore } from '../config/firebase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

// Initialize Firebase
initializeFirebase();

const router = express.Router();

// Get all artisans with pagination
router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('craft').optional().isString(),
    query('location').optional().isString(),
    query('verified').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      const db = getFirestore();
      const { page = 1, limit = 20, craft, location, verified } = req.query;

      let query = db.collection('users').where('role', '==', 'artisan');

      // Apply filters
      if (verified !== undefined) {
        query = query.where(
          'artisan_profile.isVerified',
          '==',
          verified === 'true'
        );
      }

      const snapshot = await query.get();
      let artisans = [];

      snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.artisan_profile) {
          artisans.push({
            id: doc.id,
            ...userData,
          });
        }
      });

      // Client-side filtering (can be optimized with proper indexing)
      if (craft) {
        artisans = artisans.filter(
          artisan =>
            artisan.artisan_profile.craft
              .toLowerCase()
              .includes(craft.toLowerCase()) ||
            (artisan.artisan_profile.specialties &&
              artisan.artisan_profile.specialties.some(s =>
                s.toLowerCase().includes(craft.toLowerCase())
              ))
        );
      }

      if (location) {
        artisans = artisans.filter(artisan =>
          artisan.artisan_profile.location
            .toLowerCase()
            .includes(location.toLowerCase())
        );
      }

      // Pagination
      const total = artisans.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginatedArtisans = artisans.slice(
        offset,
        offset + parseInt(limit)
      );

      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        artisans: paginatedArtisans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      });
    } catch (error) {
      console.error('Get artisans error:', error);
      res.status(500).json({ error: 'Failed to fetch artisans' });
    }
  }
);

// Get single artisan
router.get('/:id', async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.params.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Artisan not found' });
    }

    const userData = userDoc.data();

    if (userData.role !== 'artisan' || !userData.artisan_profile) {
      return res.status(404).json({ error: 'User is not an artisan' });
    }

    const artisan = {
      id: userDoc.id,
      ...userData,
    };

    res.json(artisan);
  } catch (error) {
    console.error('Get artisan error:', error);
    res.status(500).json({ error: 'Failed to fetch artisan' });
  }
});

// Get artisan's products
router.get(
  '/:id/products',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'sold_out']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors.array() });
      }

      const db = getFirestore();
      const { page = 1, limit = 20, status = 'active' } = req.query;

      // Check if artisan exists
      const artisanDoc = await db.collection('users').doc(req.params.id).get();
      if (!artisanDoc.exists || artisanDoc.data().role !== 'artisan') {
        return res.status(404).json({ error: 'Artisan not found' });
      }

      let query = db
        .collection('products')
        .where('artisan_id', '==', req.params.id)
        .where('status', '==', status);

      // Get total count
      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      // Apply pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      query = query
        .orderBy('createdAt', 'desc')
        .offset(offset)
        .limit(parseInt(limit));

      const snapshot = await query.get();
      const products = [];

      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        products,
        artisan: {
          id: artisanDoc.id,
          name: artisanDoc.data().name,
          email: artisanDoc.data().email,
          artisan_profile: artisanDoc.data().artisan_profile,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      });
    } catch (error) {
      console.error('Get artisan products error:', error);
      res.status(500).json({ error: 'Failed to fetch artisan products' });
    }
  }
);

// Update artisan profile (authenticated artisan only)
router.put(
  '/profile',
  [authenticateToken, requireRole('artisan')],
  async (req, res) => {
    try {
      const db = getFirestore();
      const updates = {
        artisan_profile: {
          ...req.body,
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      // Remove fields that shouldn't be updated
      delete updates.artisan_profile.id;
      delete updates.artisan_profile.createdAt;
      delete updates.artisan_profile.isVerified; // Only admin can verify
      delete updates.artisan_profile.rating;
      delete updates.artisan_profile.reviewCount;
      delete updates.artisan_profile.followerCount;
      delete updates.artisan_profile.totalSales;

      await db.collection('users').doc(req.user.uid).update(updates);

      // Get updated user data
      const updatedDoc = await db.collection('users').doc(req.user.uid).get();
      const updatedUser = updatedDoc.data();

      res.json(updatedUser);
    } catch (error) {
      console.error('Update artisan profile error:', error);
      res.status(500).json({ error: 'Failed to update artisan profile' });
    }
  }
);

export default router;
