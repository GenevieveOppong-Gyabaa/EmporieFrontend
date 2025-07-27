import { BACKEND_URL } from '../constants/config';
import { CartItem } from '../context/cartContext';

const API_URL = `${BACKEND_URL}/api/cart`;

export async function fetchCart(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch cart from backend.', error);
    return [];
  }
}