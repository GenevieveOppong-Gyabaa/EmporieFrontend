import type { Deal } from "@/data/deals";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { fetchCart, updateCart } from '../services/cartService';

export interface CartItem {
  id: string // unique cart item id
  dealId: number
  deal: Deal
  quantity: number
  selectedColor?: string
  selectedSize?: string
  addedAt: Date
}

export interface CartContextType {
  cartItems: CartItem[]
  addToCart: (deal: Deal, quantity: number, selectedColor?: string, selectedSize?: string) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  loadCart: (userId?: string) => Promise<void>
}

let cartState: CartItem[] = []
let cartListeners: (() => void)[] = []

const CART_STORAGE_KEY = 'emporie_cart';

export const useCart = (userId?: string): CartContextType => {
  const [, forceUpdate] = useState({})

  const triggerUpdate = async () => {
    forceUpdate({})
    cartListeners.forEach(listener => listener())
    // Save to AsyncStorage
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    // Sync to backend if userId is present
    if (userId) {
      await updateCart(userId, cartState);
    }
  }

  const loadCart = async (userId?: string) => {
    if (userId) {
      // Try to fetch from backend
      const backendCart = await fetchCart(userId);
      if (backendCart && backendCart.length > 0) {
        cartState = backendCart;
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
        triggerUpdate();
        return;
      }
    }
    // Fallback to AsyncStorage
    const localCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    cartState = localCart ? JSON.parse(localCart) : [];
    triggerUpdate();
  }

  const addToCart = (deal: Deal, quantity: number, selectedColor?: string, selectedSize?: string) => {
    const existingItemIndex = cartState.findIndex(
      item => 
        item.dealId === deal.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    )
    if (existingItemIndex >= 0) {
      cartState[existingItemIndex].quantity += quantity
    } else {
      const newItem: CartItem = {
        id: `${deal.id}-${selectedColor || 'default'}-${selectedSize || 'default'}-${Date.now()}`,
        dealId: deal.id,
        deal,
        quantity,
        selectedColor,
        selectedSize,
        addedAt: new Date(),
      }
      cartState.push(newItem)
    }
    triggerUpdate()
  }

  const removeFromCart = (cartItemId: string) => {
    cartState = cartState.filter(item => item.id !== cartItemId)
    triggerUpdate()
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    const itemIndex = cartState.findIndex(item => item.id === cartItemId)
    if (itemIndex >= 0) {
      cartState[itemIndex].quantity = quantity
      triggerUpdate()
    }
  }

  const clearCart = () => {
    cartState = []
    triggerUpdate()
  }

  const getCartTotal = () => {
    return cartState.reduce((total, item) => {
      const price = parseFloat(item.deal.salePrice.replace('$', ''))
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartState.reduce((count, item) => count + item.quantity, 0)
  }

  useEffect(() => {
    loadCart(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    cartItems: cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    loadCart,
  }
}