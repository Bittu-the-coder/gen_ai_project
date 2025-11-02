import express from 'express';
import { body, validationResult } from 'express-validator';
import initializeFirebase, { getFirestore } from '../config/firebase.js';
import { handleFirestoreError } from '../utils/errorHandler.js';

// Initialize Firebase
initializeFirebase();

const router = express.Router();

// Health check for Firestore connection
router.get('/health', async (req, res) => {
  try {
    const db = getFirestore();
    // Try to read from a collection to test Firestore access
    await db.collection('health-check').limit(1).get();
    res.json({ status: 'healthy', firestore: 'connected' });
  } catch (error) {
    console.error('Firestore health check failed:', error);
    handleFirestoreError(error, res, 'Firestore connection failed');
  }
});

// Get user profile
router.get('/', async (req, res) => {
  try {
    console.log('Getting profile for user:', req.user.uid);
    const db = getFirestore();

    let userDoc;
    try {
      userDoc = await db.collection('users').doc(req.user.uid).get();
    } catch (firestoreError) {
      console.error('Firestore access error:', firestoreError);
      return handleFirestoreError(
        firestoreError,
        res,
        'Failed to access user database'
      );
    }

    if (!userDoc.exists) {
      console.log('User profile does not exist, creating new one');

      // Create user profile from Firebase Auth data
      const newUser = {
        id: req.user.uid,
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.email.split('@')[0],
        emailVerified: req.user.emailVerified || false,
        photoURL: req.user.picture || null,
        role: 'customer', // default role
        status: 'active',
        preferences: {
          language: 'en',
          currency: 'INR',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
        profile: {
          firstName: req.user.name?.split(' ')[0] || '',
          lastName: req.user.name?.split(' ').slice(1).join(' ') || '',
          phone: '',
          bio: '',
          avatar: req.user.picture || null,
          location: {
            city: '',
            state: '',
            country: 'India',
          },
        },
        stats: {
          ordersPlaced: 0,
          totalSpent: 0,
          productsListed: 0,
          totalEarnings: 0,
          rating: 0,
          reviewCount: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      try {
        await db.collection('users').doc(req.user.uid).set(newUser);
        console.log('New user profile created successfully');
        return res.json(newUser);
      } catch (createError) {
        console.error('Failed to create user profile:', createError);
        return handleFirestoreError(
          createError,
          res,
          'Failed to create user profile'
        );
      }
    }

    const userData = userDoc.data();
    console.log('User profile found, updating last login');

    // Update last login (but don't fail the request if this fails)
    try {
      await db.collection('users').doc(req.user.uid).update({
        lastLoginAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.warn('Failed to update last login:', updateError);
      // Don't return error for this, just log it
    }

    res.json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    handleFirestoreError(error, res, 'Failed to fetch user profile');
  }
});

// Update user profile
router.put(
  '/',
  [
    body('displayName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Display name cannot be empty'),
    body('profile.firstName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('First name cannot be empty'),
    body('profile.lastName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Last name cannot be empty'),
    body('profile.phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Invalid phone number'),
    body('profile.bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('role')
      .optional()
      .isIn(['customer', 'artisan'])
      .withMessage('Invalid role'),
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
      const userRef = db.collection('users').doc(req.user.uid);

      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      // Don't allow updating certain fields
      delete updateData.id;
      delete updateData.uid;
      delete updateData.email;
      delete updateData.createdAt;
      delete updateData.stats;

      await userRef.update(updateData);
      console.log('Profile updated successfully');

      const updatedDoc = await userRef.get();
      const updatedUser = updatedDoc.data();

      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      handleFirestoreError(error, res, 'Failed to update user profile');
    }
  }
);

// Delete user profile
router.delete('/', async (req, res) => {
  try {
    const db = getFirestore();

    // Check if user has any active orders or products
    const ordersSnapshot = await db
      .collection('orders')
      .where('customer_id', '==', req.user.uid)
      .where('status', 'in', ['pending', 'confirmed', 'processing', 'shipped'])
      .get();

    if (!ordersSnapshot.empty) {
      return res.status(400).json({
        error:
          'Cannot delete profile with active orders. Please complete or cancel all orders first.',
      });
    }

    const productsSnapshot = await db
      .collection('products')
      .where('artisan_id', '==', req.user.uid)
      .where('status', '==', 'active')
      .get();

    if (!productsSnapshot.empty) {
      return res.status(400).json({
        error:
          'Cannot delete profile with active products. Please deactivate all products first.',
      });
    }

    // Mark user as deleted instead of actually deleting
    await db.collection('users').doc(req.user.uid).update({
      status: 'deleted',
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete user profile' });
  }
});

// Update user role (artisan application)
router.post(
  '/apply-artisan',
  [
    body('profile.bio')
      .isLength({ min: 50 })
      .withMessage(
        'Bio must be at least 50 characters for artisan application'
      ),
    body('profile.skills')
      .isArray({ min: 1 })
      .withMessage('At least one skill is required'),
    body('profile.experience')
      .isInt({ min: 0 })
      .withMessage('Experience must be a positive number'),
    body('profile.location.city').notEmpty().withMessage('City is required'),
    body('profile.location.state').notEmpty().withMessage('State is required'),
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
      const userRef = db.collection('users').doc(req.user.uid);

      const updateData = {
        role: 'artisan',
        status: 'pending', // Pending approval
        isVerified: false,
        profile: {
          ...req.body.profile,
        },
        artisanApplication: {
          appliedAt: new Date().toISOString(),
          status: 'pending',
        },
        updatedAt: new Date().toISOString(),
      };

      await userRef.update(updateData);

      const updatedDoc = await userRef.get();
      const updatedUser = updatedDoc.data();

      res.json({
        ...updatedUser,
        message:
          'Artisan application submitted successfully. Please wait for approval.',
      });
    } catch (error) {
      console.error('Apply artisan error:', error);
      res.status(500).json({ error: 'Failed to submit artisan application' });
    }
  }
);

export default router;
