const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', '),
      details: errors,
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid',
    });
  }

  // Firestore errors
  if (err.code === 7 || err.reason === 'SERVICE_DISABLED') {
    return res.status(503).json({
      success: false,
      error: 'FIRESTORE_DISABLED',
      message:
        'Database service is currently unavailable. Please enable Firestore in your Firebase project.',
      helpUrl: `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${process.env.FIREBASE_PROJECT_ID}`,
      details:
        'Visit the Firebase Console and enable Firestore Database for your project.',
    });
  }

  if (err.code === 'PERMISSION_DENIED') {
    return res.status(403).json({
      success: false,
      error: 'PERMISSION_DENIED',
      message: 'Insufficient permissions to access the database.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please provide a valid authentication token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Please login again',
    });
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size exceeds the maximum allowed limit',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected field',
      message: 'Unexpected file field in upload',
    });
  }

  // Firebase errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Authentication error',
      message: err.message,
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });
};

export default errorHandler;
