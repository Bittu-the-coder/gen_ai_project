import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'VoiceCraft Market API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
  });
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      services: {
        firebase: 'unknown',
        storage: 'unknown',
      },
    };

    // Check Firebase connection
    try {
      const { getFirestore } = await import('../config/firebase.js');
      const db = getFirestore();
      await db.collection('health_check').doc('test').set({
        timestamp: new Date().toISOString(),
      });
      health.services.firebase = 'healthy';
    } catch (error) {
      console.error('Firebase health check failed:', error);
      health.services.firebase = 'unhealthy';
      health.status = 'degraded';
    }

    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
