// Product model schema for validation and documentation
export const ProductSchema = {
  id: {
    type: 'string',
    required: true,
    description: 'Unique product identifier',
  },
  artisan_id: {
    type: 'string',
    required: true,
    description: 'ID of the artisan who created this product',
  },
  title: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 200,
    description: 'Product title',
  },
  description: {
    type: 'string',
    required: true,
    minLength: 10,
    maxLength: 2000,
    description: 'Detailed product description',
  },
  category: {
    type: 'string',
    required: true,
    enum: [
      'Ceramics & Pottery',
      'Textiles & Fabrics',
      'Woodwork',
      'Metalwork',
      'Jewelry',
      'Leather Goods',
      'Paintings & Art',
      'Sculptures',
      'Home Decor',
      'Kitchen & Dining',
      'Bags & Accessories',
      'Furniture',
      'Traditional Crafts',
      'Other',
    ],
    description: 'Product category',
  },
  subcategory: {
    type: 'string',
    required: false,
    description: 'Product subcategory',
  },
  price: {
    type: 'number',
    required: true,
    minimum: 1,
    maximum: 1000000,
    description: 'Product price in INR',
  },
  currency: {
    type: 'string',
    default: 'INR',
    enum: ['INR', 'USD', 'EUR'],
    description: 'Price currency',
  },
  stock: {
    type: 'number',
    required: true,
    minimum: 0,
    description: 'Available stock quantity',
  },
  images: {
    type: 'array',
    required: true,
    minItems: 1,
    maxItems: 10,
    items: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
        alt: { type: 'string' },
        order: { type: 'number' },
      },
      required: ['url'],
    },
    description: 'Product images',
  },
  dimensions: {
    type: 'object',
    properties: {
      length: { type: 'number', minimum: 0 },
      width: { type: 'number', minimum: 0 },
      height: { type: 'number', minimum: 0 },
      weight: { type: 'number', minimum: 0 },
      unit: { type: 'string', enum: ['cm', 'inch', 'mm'], default: 'cm' },
      weightUnit: { type: 'string', enum: ['kg', 'g', 'lb'], default: 'kg' },
    },
    description: 'Product dimensions and weight',
  },
  materials: {
    type: 'array',
    items: { type: 'string' },
    description: 'Materials used in the product',
  },
  colors: {
    type: 'array',
    items: { type: 'string' },
    description: 'Available colors',
  },
  tags: {
    type: 'array',
    items: { type: 'string' },
    maxItems: 20,
    description: 'Product tags for search and categorization',
  },
  techniques: {
    type: 'array',
    items: { type: 'string' },
    description: 'Crafting techniques used',
  },
  origin: {
    type: 'object',
    properties: {
      city: { type: 'string' },
      state: { type: 'string' },
      country: { type: 'string', default: 'India' },
      region: { type: 'string' },
    },
    description: 'Product origin location',
  },
  shipping: {
    type: 'object',
    properties: {
      weight: { type: 'number', minimum: 0 },
      dimensions: {
        type: 'object',
        properties: {
          length: { type: 'number' },
          width: { type: 'number' },
          height: { type: 'number' },
        },
      },
      fragile: { type: 'boolean', default: false },
      domesticShipping: { type: 'boolean', default: true },
      internationalShipping: { type: 'boolean', default: false },
      shippingCost: { type: 'number', minimum: 0 },
      estimatedDelivery: { type: 'string' },
    },
    description: 'Shipping information',
  },
  customization: {
    type: 'object',
    properties: {
      available: { type: 'boolean', default: false },
      options: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['text', 'select', 'color', 'size'] },
            options: { type: 'array', items: { type: 'string' } },
            required: { type: 'boolean', default: false },
            additionalCost: { type: 'number', minimum: 0, default: 0 },
          },
        },
      },
      leadTime: { type: 'string' },
    },
    description: 'Customization options',
  },
  status: {
    type: 'string',
    enum: ['draft', 'active', 'inactive', 'sold_out', 'discontinued'],
    default: 'draft',
    description: 'Product status',
  },
  featured: {
    type: 'boolean',
    default: false,
    description: 'Whether product is featured',
  },
  stats: {
    type: 'object',
    properties: {
      views: { type: 'number', default: 0 },
      likes: { type: 'number', default: 0 },
      sold: { type: 'number', default: 0 },
      rating: { type: 'number', minimum: 0, maximum: 5 },
      reviewCount: { type: 'number', default: 0 },
    },
    description: 'Product statistics',
  },
  seo: {
    type: 'object',
    properties: {
      metaTitle: { type: 'string', maxLength: 60 },
      metaDescription: { type: 'string', maxLength: 160 },
      keywords: { type: 'array', items: { type: 'string' } },
      slug: { type: 'string' },
    },
    description: 'SEO optimization fields',
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    description: 'Product creation timestamp',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    description: 'Last update timestamp',
  },
  publishedAt: {
    type: 'string',
    format: 'date-time',
    description: 'Product publication timestamp',
  },
};

// Validation functions
export const validateProduct = productData => {
  const errors = [];

  // Required fields validation
  if (!productData.title || productData.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!productData.description || productData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (!productData.category) {
    errors.push('Category is required');
  }

  if (!productData.price || productData.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (productData.stock === undefined || productData.stock < 0) {
    errors.push('Stock must be 0 or greater');
  }

  if (
    !productData.images ||
    !Array.isArray(productData.images) ||
    productData.images.length === 0
  ) {
    errors.push('At least one image is required');
  }

  // Validate images
  if (productData.images && Array.isArray(productData.images)) {
    productData.images.forEach((image, index) => {
      if (!image.url || !isValidUrl(image.url)) {
        errors.push(`Image ${index + 1}: Invalid URL`);
      }
    });
  }

  // Validate category
  const validCategories = [
    'Ceramics & Pottery',
    'Textiles & Fabrics',
    'Woodwork',
    'Metalwork',
    'Jewelry',
    'Leather Goods',
    'Paintings & Art',
    'Sculptures',
    'Home Decor',
    'Kitchen & Dining',
    'Bags & Accessories',
    'Furniture',
    'Traditional Crafts',
    'Other',
  ];

  if (productData.category && !validCategories.includes(productData.category)) {
    errors.push('Invalid category specified');
  }

  // Validate dimensions if provided
  if (productData.dimensions) {
    const { length, width, height, weight } = productData.dimensions;
    if (
      (length !== undefined && length < 0) ||
      (width !== undefined && width < 0) ||
      (height !== undefined && height < 0) ||
      (weight !== undefined && weight < 0)
    ) {
      errors.push('Dimensions and weight must be positive numbers');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProductUpdate = updateData => {
  const errors = [];

  // Validate only fields being updated
  if (updateData.title !== undefined && updateData.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (
    updateData.description !== undefined &&
    updateData.description.trim().length < 10
  ) {
    errors.push('Description must be at least 10 characters long');
  }

  if (updateData.price !== undefined && updateData.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (updateData.stock !== undefined && updateData.stock < 0) {
    errors.push('Stock must be 0 or greater');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
const isValidUrl = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateProductSlug = title => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .trim('-'); // Remove leading/trailing hyphens
};

export const calculateProductScore = product => {
  // Simple scoring algorithm based on completeness and engagement
  let score = 0;

  // Basic info completeness (40%)
  if (product.title) score += 10;
  if (product.description && product.description.length > 50) score += 10;
  if (product.images && product.images.length >= 3) score += 10;
  if (product.category) score += 10;

  // Additional details (30%)
  if (product.materials && product.materials.length > 0) score += 5;
  if (product.dimensions) score += 5;
  if (product.origin) score += 5;
  if (product.tags && product.tags.length >= 3) score += 5;
  if (product.techniques && product.techniques.length > 0) score += 5;
  if (product.shipping) score += 5;

  // Engagement metrics (30%)
  if (product.stats) {
    score += Math.min(15, product.stats.views / 10); // Max 15 points for views
    score += Math.min(10, product.stats.likes * 2); // Max 10 points for likes
    score += Math.min(5, product.stats.sold); // Max 5 points for sales
  }

  return Math.min(100, Math.round(score));
};

export default ProductSchema;
