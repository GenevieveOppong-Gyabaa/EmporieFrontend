import { CartItem } from '../context/cartContext';

const API_URL = 'http://your-backend.com/api/cart';

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

export async function updateCart(userId: string, cart: CartItem[]): Promise<void> {
  try {
    await fetch(`${API_URL}?userId=${userId}` , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart),
    });
  } catch (error) {
    console.warn('Failed to update cart on backend.', error);
    // Optionally queue for retry or fallback to local storage
  }
} 