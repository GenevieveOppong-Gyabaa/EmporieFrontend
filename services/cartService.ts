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
export const addToCart = async (item: Omit<CartItem, 'id'>): Promise<CartItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    return { ...item, id: Date.now().toString() };
  }
};

// Get cart items
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart`, {
      headers: {

      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch cart');
    }
  } catch (error) {
    console.log('Backend not available, returning empty cart:', error);
    return { items: [], total: 0 };
  }
};
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
export const removeFromCart = async (itemId: string): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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