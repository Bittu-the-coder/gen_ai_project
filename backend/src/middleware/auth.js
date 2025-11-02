import initializeFirebase, { getAuth } from '../config/firebase.js';

// Initialize Firebase
initializeFirebase();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(token);

    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      firebase: decodedToken,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Token revoked' });
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = requiredRole => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get user from Firestore to check role
      const { getFirestore } = await import('../config/firebase.js');
      const { handleFirestoreError } = await import('../utils/errorHandler.js');

      const db = getFirestore();
      const userDoc = await db.collection('users').doc(req.user.uid).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      const userData = userDoc.data();

      if (userData.role !== requiredRole) {
        return res.status(403).json({
          error: `Access denied. ${requiredRole} role required`,
          userRole: userData.role,
        });
      }

      req.userProfile = userData;
      next();
    } catch (error) {
      console.error('Role check error:', error);

      // Handle Firestore specific errors
      if (
        error.code === 7 &&
        error.message.includes('Cloud Firestore API has not been used')
      ) {
        return res.status(503).json({
          error: 'Database service unavailable',
          message: 'Please enable Firestore API in your Firebase project',
          code: 'FIRESTORE_DISABLED',
        });
      }

      if (error.code === 'permission-denied') {
        return res.status(403).json({ error: 'Database access denied' });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default { authenticateToken, requireRole };
