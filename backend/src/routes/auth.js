import express from 'express';
import initializeFirebase, { getFirestore } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

// Initialize Firebase
initializeFirebase();

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      // Create user profile from Firebase Auth data
      const newUser = {
        id: req.user.uid,
        email: req.user.email,
        name: req.user.name || req.user.email.split('@')[0],
        emailVerified: req.user.emailVerified || false,
        profilePicture: req.user.picture || null,
        role: 'customer', // default role
        status: 'active',
        language: 'english',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('users').doc(req.user.uid).set(newUser);
      return res.json(newUser);
    }

    const userData = userDoc.data();
    res.json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const updates = { ...req.body };

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.email;
    delete updates.createdAt;
    delete updates.emailVerified;

    // Add updated timestamp
    updates.updatedAt = new Date().toISOString();

    // If updating to artisan role, ensure artisan_profile exists
    if (updates.role === 'artisan' && updates.artisan_profile) {
      updates.artisan_profile = {
        ...updates.artisan_profile,
        createdAt:
          updates.artisan_profile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        followerCount: 0,
        totalSales: 0,
      };
    }

    await db.collection('users').doc(req.user.uid).update(updates);

    // Get updated user data
    const updatedDoc = await db.collection('users').doc(req.user.uid).get();
    const updatedUser = updatedDoc.data();

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Login endpoint (handled by Firebase on frontend)
router.post('/login', (req, res) => {
  res.json({
    message: 'Authentication is handled by Firebase on the frontend',
    instructions: [
      '1. Use Firebase Auth SDK on frontend',
      '2. Get ID token from Firebase',
      '3. Send token in Authorization header as "Bearer <token>"',
      '4. Use /api/v1/profile to get/update user data',
    ],
  });
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Optionally revoke the token on server side
    // await admin.auth().revokeRefreshTokens(req.user.uid);

    res.json({
      message: 'Logged out successfully',
      instructions: 'Clear the token from client-side storage',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
