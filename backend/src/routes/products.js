import express from 'express';
import { body, query, validationResult } from 'express-validator';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import initializeFirebase, {
  getFirestore,
  getStorage,
} from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

// Initialize Firebase
initializeFirebase();

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Get all products with pagination and filters
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
    query('category').optional().isString(),
    query('search').optional().isString(),
    query('artisan_id').optional().isString(),
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
      const {
        page = 1,
        limit = 20,
        category,
        search,
        artisan_id,
        status = 'active',
      } = req.query;

      let query = db.collection('products');

      // Start with status filter only
      query = query.where('status', '==', status);

      // Apply filters
      if (category) {
        query = query.where('category', '==', category);
      }

      if (artisan_id) {
        query = query.where('artisan_id', '==', artisan_id);
      }

      // Get all matching documents first
      const snapshot = await query.get();
      let products = [];

      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort by created_at in memory to avoid Firestore composite index requirement
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Filter by search term before pagination
      let filteredProducts = products;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = products.filter(
          product =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            (product.tags &&
              product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }

      const total = filteredProducts.length;

      // Apply pagination in memory
      const offset = (parseInt(page) - 1) * parseInt(limit);
      filteredProducts = filteredProducts.slice(
        offset,
        offset + parseInt(limit)
      );

      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        products: filteredProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredProducts.length,
          totalPages,
          hasNext,
          hasPrev,
        },
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
);

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = getFirestore();
    const productDoc = await db.collection('products').doc(req.params.id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data(),
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (authenticated users)
router.post(
  '/',
  [
    authenticateToken,
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description')
      .isString()
      .notEmpty()
      .withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').isString().notEmpty().withMessage('Category is required'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
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
      const productData = {
        ...req.body,
        id: uuidv4(),
        artisan_id: req.user.uid,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 0,
        like_count: 0,
        share_count: 0,
        sales_count: 0,
        images: req.body.images || [],
      };

      const productRef = db.collection('products').doc(productData.id);
      await productRef.set(productData);

      res.status(201).json(productData);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (owner only)
router.put(
  '/:id',
  [
    authenticateToken,
    body('title').optional().isString().notEmpty(),
    body('description').optional().isString().notEmpty(),
    body('price').optional().isNumeric(),
    body('stock').optional().isInt({ min: 0 }),
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
      const productRef = db.collection('products').doc(req.params.id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const productData = productDoc.data();

      // Check if user owns this product
      if (productData.artisan_id !== req.user.uid) {
        return res.status(403).json({
          error: 'Access denied. You can only update your own products.',
        });
      }

      const updates = {
        ...req.body,
        updated_at: new Date().toISOString(),
      };

      // Remove fields that shouldn't be updated
      delete updates.id;
      delete updates.artisan_id;
      delete updates.created_at;

      await productRef.update(updates);

      const updatedDoc = await productRef.get();
      const updatedProduct = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };

      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product (owner only)
router.delete('/:id', [authenticateToken], async (req, res) => {
  try {
    const db = getFirestore();
    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = productDoc.data();

    // Check if user owns this product
    if (productData.artisan_id !== req.user.uid) {
      return res.status(403).json({
        error: 'Access denied. You can only delete your own products.',
      });
    }

    await productRef.delete();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Upload product images
router.post(
  '/:id/images',
  [
    authenticateToken,
    upload.array('images', 5), // Max 5 images
  ],
  async (req, res) => {
    try {
      const db = getFirestore();
      const storage = getStorage();
      const bucket = storage.bucket();

      const productRef = db.collection('products').doc(req.params.id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const productData = productDoc.data();

      // Check if user owns this product
      if (productData.artisan_id !== req.user.uid) {
        return res.status(403).json({
          error: 'Access denied. You can only update your own products.',
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images provided' });
      }

      // For now, return mock URLs since Firebase Storage isn't properly configured
      // TODO: Set up proper Firebase Storage bucket
      const mockImageUrls = req.files.map(
        (file, index) =>
          `https://via.placeholder.com/400x400.png?text=Product+Image+${
            index + 1
          }`
      );

      // Update product with image URLs
      await productRef.update({
        images: mockImageUrls,
        updated_at: new Date(),
      });

      console.log('Mock image upload completed for product:', req.params.id);

      res.json({
        success: true,
        images: mockImageUrls,
        message: 'Images uploaded successfully (mock)',
      });
    } catch (error) {
      console.error('Upload images error:', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  }
);

// Commented out original Firebase Storage code for when bucket is properly set up
/*
      const uploadPromises = req.files.map(async file => {
        const fileName = `products/${req.params.id}/${uuidv4()}_${
          file.originalname
        }`;
        const fileUpload = bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        return new Promise((resolve, reject) => {
          stream.on('error', reject);
          stream.on('finish', async () => {
            try {
              await fileUpload.makePublic();
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              resolve(publicUrl);
            } catch (error) {
              reject(error);
            }
          });
          stream.end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Update product with new image URLs
      const currentImages = productData.images || [];
      const updatedImages = [...currentImages, ...imageUrls];

      await productRef.update({
        images: updatedImages,
        updatedAt: new Date().toISOString(),
      });

      res.json({
        message: 'Images uploaded successfully',
        images: imageUrls,
        totalImages: updatedImages.length,
      });
*/

export default router;
