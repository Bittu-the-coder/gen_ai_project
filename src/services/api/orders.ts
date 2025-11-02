// Orders API Service
import apiClient from './client';
import type { Address, Order, PaginatedResponse } from './types';

export const ordersApi = {
  // Get user orders
  getUserOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: {
    items: Array<{ product_id: string; quantity: number }>;
    shipping_address: Address;
    billing_address?: Address;
  }): Promise<Order> => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get artisan orders (artisan only)
  getArtisanOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get('/artisan/orders', { params });
    return response.data;
  },

  // Update order status (artisan only)
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiClient.put(`/artisan/orders/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export default ordersApi;
