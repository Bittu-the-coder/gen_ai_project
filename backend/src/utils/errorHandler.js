/**
 * Centralized error handling utilities
 */

/**
 * Handle Firestore-specific errors
 * @param {Error} error - The error object
 * @param {Response} res - Express response object
 * @param {string} defaultMessage - Default error message
 */
export const handleFirestoreError = (
  error,
  res,
  defaultMessage = 'Database operation failed'
) => {
  console.error('Firestore error:', error);

  // Handle Firestore API disabled error
  if (error.code === 7 || error.reason === 'SERVICE_DISABLED') {
    return res.status(503).json({
      success: false,
      message:
        'Database service is currently unavailable. Please enable Firestore in your Firebase project.',
      error: 'FIRESTORE_DISABLED',
      helpUrl: `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${process.env.FIREBASE_PROJECT_ID}`,
      details:
        'Visit the Firebase Console and enable Firestore Database for your project.',
    });
  }

  // Handle permission errors
  if (error.code === 'PERMISSION_DENIED') {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to access the database.',
      error: 'PERMISSION_DENIED',
    });
  }

  // Handle network/connectivity errors
  if (error.code === 'UNAVAILABLE') {
    return res.status(503).json({
      success: false,
      message: 'Database service is temporarily unavailable. Please try again.',
      error: 'SERVICE_UNAVAILABLE',
    });
  }

  // Generic database error
  return res.status(500).json({
    success: false,
    message: defaultMessage,
    error: error.message || 'Unknown database error',
  });
};

/**
 * Handle authentication errors
 * @param {Error} error - The error object
 * @param {Response} res - Express response object
 */
export const handleAuthError = (error, res) => {
  console.error('Auth error:', error);

  if (error.code === 'auth/user-not-found') {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      error: 'USER_NOT_FOUND',
    });
  }

  if (error.code === 'auth/invalid-email') {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address',
      error: 'INVALID_EMAIL',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication failed',
    error: error.message,
  });
};

/**
 * Generic error handler
 * @param {Error} error - The error object
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 */
export const handleGenericError = (
  error,
  res,
  message = 'An error occurred'
) => {
  console.error('Generic error:', error);

  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};
