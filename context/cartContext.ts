import type { Deal } from "@/data/deals"
import { useState } from "react"

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
}

// Simple cart state management (you could use Context API or Redux for more complex apps)
let cartState: CartItem[] = []
let cartListeners: (() => void)[] = []

export const useCart = (): CartContextType => {
  const [, forceUpdate] = useState({})

  const triggerUpdate = () => {
    forceUpdate({})
    cartListeners.forEach(listener => listener())
  }

  const addToCart = (deal: Deal, quantity: number, selectedColor?: string, selectedSize?: string) => {
    // Check if item with same deal, color, and size already exists
    const existingItemIndex = cartState.findIndex(
      item => 
        item.dealId === deal.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    )

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cartState[existingItemIndex].quantity += quantity
    } else {
      // Add new item
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

  return {
    cartItems: cartState,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }
}
