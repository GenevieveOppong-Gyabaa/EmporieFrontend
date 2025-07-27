import type { Deal } from "@/data/deals";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
//import { fetchCart } from '../services/cartService';

export interface CartItem {
  id: string 
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



