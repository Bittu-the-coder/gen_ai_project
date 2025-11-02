import express from 'express';
import { getFirestore } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';
import Cart from '../models/Cart.js';
import { handleFirestoreError } from '../utils/errorHandler.js';

const db = getFirestore();

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartDoc = await db.collection('carts').doc(userId).get();

    if (!cartDoc.exists) {
      // Return empty cart if no cart exists
      return res.json({
        success: true,
        cart: {
          userId,
          items: [],
          total: 0,
        },
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    res.json({
      success: true,
      cart: {
        userId: cart.userId,
        items: cart.items,
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    handleFirestoreError(error, res, 'Failed to fetch cart');
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity = 1, price, name, image } = req.body;

    if (!productId || !price || !name) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, price, and name are required',
      });
    }

    // Get existing cart or create new one
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    let cart;
    if (cartDoc.exists) {
      cart = Cart.fromFirestore(cartDoc);
    } else {
      cart = new Cart(userId);
    }

    cart.addItem(productId, quantity, price, name, image);

    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        userId: cart.userId,
        items: cart.items,
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    handleFirestoreError(error, res, 'Failed to add item to cart');
  }
});

// Update item quantity
router.put('/update/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be positive',
      });
    }

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.updateQuantity(productId, quantity);

    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        userId: cart.userId,
        items: cart.items,
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    handleFirestoreError(error, res, 'Failed to update cart');
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.removeItem(productId);

    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        userId: cart.userId,
        items: cart.items,
        total: cart.getTotal(),
      },
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    handleFirestoreError(error, res, 'Failed to remove item from cart');
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const cartRef = db.collection('carts').doc(userId);
    await cartRef.delete();

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    handleFirestoreError(error, res, 'Failed to clear cart');
  }
});

export default router;
