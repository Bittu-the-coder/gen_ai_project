// Products API Service
import apiClient from './client';
import type { PaginatedResponse, Product } from './types';

export const productsApi = {
  // Get all products with pagination and filters
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products', { params });
    // Backend returns { products: [...], pagination: { page, limit, total, totalPages, hasNext, hasPrev } }
    // Map it to the frontend PaginatedResponse shape { data, page, limit, total, has_more }
    const server = response.data || {};
    const products = server.products || [];
    const pagination = server.pagination || {};

    return {
      data: products,
      page: pagination.page || params?.page || 1,
      limit: pagination.limit || params?.limit || 20,
      total: pagination.total || products.length,
      total_pages:
        pagination.totalPages ||
        Math.ceil(
          (pagination.total || products.length) /
            (pagination.limit || params?.limit || 20)
        ),
      has_more: pagination.hasNext || false,
    } as PaginatedResponse<Product>;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, limit = 20): Promise<Product[]> => {
    const response = await apiClient.get('/products/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Get products by artisan
  getProductsByArtisan: async (artisanId: string): Promise<Product[]> => {
    const response = await apiClient.get(`/artisans/${artisanId}/products`);
    return response.data;
  },

  // Create product
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (
    id: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Upload product images
  uploadProductImages: async (
    id: string,
    images: File[]
  ): Promise<string[]> => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    const response = await apiClient.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Backend may return { images: [...] } or { urls: [...] }
    return response.data.images || response.data.urls || [];
  },
};

export default productsApi;
