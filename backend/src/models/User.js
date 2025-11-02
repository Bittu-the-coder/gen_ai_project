// User model schema for validation and documentation
export const UserSchema = {
  uid: {
    type: 'string',
    required: true,
    description: 'Firebase user ID',
  },
  email: {
    type: 'string',
    required: true,
    format: 'email',
    description: 'User email address',
  },
  displayName: {
    type: 'string',
    required: false,
    description: 'User display name',
  },
  role: {
    type: 'string',
    enum: ['customer', 'artisan', 'admin'],
    default: 'customer',
    description: 'User role in the system',
  },
  profile: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      phone: { type: 'string' },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string', default: 'India' },
        },
      },
      avatar: { type: 'string', format: 'uri' },
      bio: { type: 'string' },
      skills: { type: 'array', items: { type: 'string' } },
      specializations: { type: 'array', items: { type: 'string' } },
      experience: { type: 'number', minimum: 0 },
      location: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          state: { type: 'string' },
          coordinates: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
          },
        },
      },
    },
  },
  preferences: {
    type: 'object',
    properties: {
      language: { type: 'string', default: 'en' },
      currency: { type: 'string', default: 'INR' },
      notifications: {
        type: 'object',
        properties: {
          email: { type: 'boolean', default: true },
          push: { type: 'boolean', default: true },
          sms: { type: 'boolean', default: false },
        },
      },
      categories: { type: 'array', items: { type: 'string' } },
    },
  },
  stats: {
    type: 'object',
    properties: {
      ordersPlaced: { type: 'number', default: 0 },
      totalSpent: { type: 'number', default: 0 },
      productsListed: { type: 'number', default: 0 },
      totalEarnings: { type: 'number', default: 0 },
      rating: { type: 'number', minimum: 0, maximum: 5 },
      reviewCount: { type: 'number', default: 0 },
    },
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'active',
  },
  isVerified: {
    type: 'boolean',
    default: false,
    description: 'Whether artisan profile is verified',
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    description: 'Account creation timestamp',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    description: 'Last profile update timestamp',
  },
  lastLoginAt: {
    type: 'string',
    format: 'date-time',
    description: 'Last login timestamp',
  },
};

// Validation functions
export const validateUser = userData => {
  const errors = [];

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }

  if (
    userData.role &&
    !['customer', 'artisan', 'admin'].includes(userData.role)
  ) {
    errors.push('Invalid role specified');
  }

  if (userData.profile?.phone && !isValidPhone(userData.profile.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUserUpdate = updateData => {
  const errors = [];

  // Only validate fields that are being updated
  if (updateData.email !== undefined && !isValidEmail(updateData.email)) {
    errors.push('Invalid email format');
  }

  if (
    updateData.role !== undefined &&
    !['customer', 'artisan', 'admin'].includes(updateData.role)
  ) {
    errors.push('Invalid role specified');
  }

  if (
    updateData.profile?.phone !== undefined &&
    !isValidPhone(updateData.profile.phone)
  ) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper validation functions
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = phone => {
  // Indian phone number validation
  const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export default UserSchema;
