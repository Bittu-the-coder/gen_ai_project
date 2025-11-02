import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import initializeFirebase, { getFirestore } from '../config/firebase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

// Initialize Firebase
initializeFirebase();

const router = express.Router();

// Get user orders
router.get(
  '/',
  [
    authenticateToken,
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status')
      .optional()
      .isIn([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ]),
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
      const { page = 1, limit = 20, status } = req.query;

      let query = db
        .collection('orders')
        .where('customer_id', '==', req.user.uid);

      if (status) {
        query = query.where('status', '==', status);
      }

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
      const orders = [];

      snapshot.forEach(doc => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        orders,
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
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
);

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const orderDoc = await db.collection('orders').doc(req.params.id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();

    // Check if user owns this order or is the artisan
    if (
      orderData.customer_id !== req.user.uid &&
      !orderData.items.some(item => item.artisan_id === req.user.uid)
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const order = {
      id: orderDoc.id,
      ...orderData,
    };

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post(
  '/',
  [
    authenticateToken,
    body('items').isArray().notEmpty().withMessage('Items array is required'),
    body('items.*.product_id')
      .isString()
      .notEmpty()
      .withMessage('Product ID is required'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('items.*.price').isNumeric().withMessage('Price must be a number'),
    body('shipping_address')
      .isObject()
      .withMessage('Shipping address is required'),
    body('shipping_address.name')
      .isString()
      .notEmpty()
      .withMessage('Name is required'),
    body('shipping_address.phone')
      .isString()
      .notEmpty()
      .withMessage('Phone is required'),
    body('shipping_address.address_line1')
      .isString()
      .notEmpty()
      .withMessage('Address is required'),
    body('shipping_address.city')
      .isString()
      .notEmpty()
      .withMessage('City is required'),
    body('shipping_address.postal_code')
      .isString()
      .notEmpty()
      .withMessage('Postal code is required'),
    body('payment_method')
      .isIn(['cod', 'online'])
      .withMessage('Invalid payment method'),
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
      const { items, shipping_address, payment_method } = req.body;

      // Validate products exist and calculate total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const productDoc = await db
          .collection('products')
          .doc(item.product_id)
          .get();

        if (!productDoc.exists) {
          return res.status(404).json({
            error: `Product ${item.product_id} not found`,
          });
        }

        const product = productDoc.data();

        // Check stock
        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for product ${product.title}. Available: ${product.stock}`,
          });
        }

        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          artisan_id: product.artisan_id,
          title: product.title,
          price: item.price,
          quantity: item.quantity,
          subtotal: itemTotal,
          image: (product.images && product.images[0]) || null,
        });
      }

      // Create order
      const orderId = uuidv4();
      const orderData = {
        id: orderId,
        customer_id: req.user.uid,
        items: orderItems,
        total_amount: totalAmount,
        currency: 'INR',
        status: 'pending',
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'unpaid',
        shipping_address,
        order_date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('orders').doc(orderId).set(orderData);

      // Update product stock
      const batch = db.batch();
      for (const item of items) {
        const productRef = db.collection('products').doc(item.product_id);
        const productDoc = await productRef.get();
        const newStock = productDoc.data().stock - item.quantity;

        batch.update(productRef, {
          stock: newStock,
          sold: (productDoc.data().sold || 0) + item.quantity,
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();

      res.status(201).json(orderData);
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// Update order status (artisan only)
router.put(
  '/:id/status',
  [
    authenticateToken,
    requireRole('artisan'),
    body('status')
      .isIn(['confirmed', 'processing', 'shipped', 'delivered'])
      .withMessage('Invalid status'),
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
      const { status } = req.body;

      const orderRef = db.collection('orders').doc(req.params.id);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const orderData = orderDoc.data();

      // Check if artisan owns any item in this order
      const hasArtisanItems = orderData.items.some(
        item => item.artisan_id === req.user.uid
      );
      if (!hasArtisanItems) {
        return res
          .status(403)
          .json({
            error:
              'Access denied. You can only update orders containing your products.',
          });
      }

      await orderRef.update({
        status,
        updatedAt: new Date().toISOString(),
        [`status_history.${status}`]: new Date().toISOString(),
      });

      const updatedDoc = await orderRef.get();
      const updatedOrder = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      };

      res.json(updatedOrder);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

// Cancel order (customer only)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const db = getFirestore();
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();

    // Check if user owns this order
    if (orderData.customer_id !== req.user.uid) {
      return res
        .status(403)
        .json({ error: 'Access denied. You can only cancel your own orders.' });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(orderData.status)) {
      return res.status(400).json({
        error: `Order cannot be cancelled. Current status: ${orderData.status}`,
      });
    }

    await orderRef.update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Restore product stock
    const batch = db.batch();
    for (const item of orderData.items) {
      const productRef = db.collection('products').doc(item.product_id);
      const productDoc = await productRef.get();

      if (productDoc.exists) {
        const newStock = productDoc.data().stock + item.quantity;
        const newSold = Math.max(
          0,
          (productDoc.data().sold || 0) - item.quantity
        );

        batch.update(productRef, {
          stock: newStock,
          sold: newSold,
          updatedAt: new Date().toISOString(),
        });
      }
    }
    await batch.commit();

    const updatedDoc = await orderRef.get();
    const cancelledOrder = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    res.json({
      ...cancelledOrder,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get artisan orders (artisan only)
router.get(
  '/artisan/orders',
  [
    authenticateToken,
    requireRole('artisan'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status')
      .optional()
      .isIn([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ]),
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
      const { page = 1, limit = 20, status } = req.query;

      // Get all orders containing artisan's products
      let query = db
        .collection('orders')
        .where('items', 'array-contains-any', [{ artisan_id: req.user.uid }]);

      if (status) {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();
      let orders = [];

      snapshot.forEach(doc => {
        const orderData = doc.data();
        // Filter to only include items belonging to this artisan
        const artisanItems = orderData.items.filter(
          item => item.artisan_id === req.user.uid
        );

        if (artisanItems.length > 0) {
          orders.push({
            id: doc.id,
            ...orderData,
            items: artisanItems,
            // Recalculate total for artisan's items only
            artisan_total: artisanItems.reduce(
              (sum, item) => sum + item.subtotal,
              0
            ),
          });
        }
      });

      // Pagination
      const total = orders.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginatedOrders = orders.slice(offset, offset + parseInt(limit));

      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNext = parseInt(page) < totalPages;
      const hasPrev = parseInt(page) > 1;

      res.json({
        orders: paginatedOrders,
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
      console.error('Get artisan orders error:', error);
      res.status(500).json({ error: 'Failed to fetch artisan orders' });
    }
  }
);

export default router;
