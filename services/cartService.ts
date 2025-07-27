import { BACKEND_URL } from '../constants/config';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Add item to cart
export const addToCart = async (item: Omit<CartItem, 'id'>): Promise<CartItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if user is logged in
        // 'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to add item to cart');
    }
  } catch (error) {
    console.log('Backend not available, using local storage:', error);
    // For now, just return the item with a mock ID
    return { ...item, id: Date.now().toString() };
  }
};

// Get cart items
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart`, {
      headers: {
        // Add Authorization header if user is logged in
        // 'Authorization': `Bearer ${user.token}`
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch cart');
    }
  } catch (error) {
    console.log('Backend not available, returning empty cart:', error);
    // Return empty cart as fallback
    return { items: [], total: 0 };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if user is logged in
        // 'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ itemId, quantity }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to update cart item');
    }
  } catch (error) {
    console.log('Backend not available:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (itemId: string): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if user is logged in
        // 'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
  } catch (error) {
    console.log('Backend not available:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        // Add Authorization header if user is logged in
        // 'Authorization': `Bearer ${user.token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  } catch (error) {
    console.log('Backend not available:', error);
    throw error;
  }
};