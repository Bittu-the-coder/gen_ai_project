import { auth } from '../../lib/firebase';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get cart
export const getCart = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (
  productId,
  quantity = 1,
  price,
  name,
  image
) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId,
        quantity,
        price,
        name,
        image,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add item to cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update item quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/update/${productId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async productId => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove item from cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to clear cart');
    }

    return data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
