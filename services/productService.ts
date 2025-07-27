import { BACKEND_URL } from '../constants/config';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    email: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  condition: 'new' | 'used' | 'refurbished';
  location: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SimilarProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
}

export const getProductDetails = async (productId: string): Promise<Product> => {
  try {
    const response = await fetch(`${BACKEND_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/products/${productId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch product reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

export const getSimilarProducts = async (productId: string): Promise<SimilarProduct[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/products/${productId}/similar`);
    if (!response.ok) {
      throw new Error('Failed to fetch similar products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching similar products:', error);
    throw error;
  }
}; 