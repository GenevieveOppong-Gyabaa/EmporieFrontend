"use client"

import type { CartItem } from "@/context/cartContext"
import { useCart } from "@/context/cartContext"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"

// const { width } = Dimensions.get("window")

interface CartPageProps {
  onBack: () => void
  onContinueShopping: () => void
}

const CartPage: React.FC<CartPageProps> = ({ onBack, onContinueShopping }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart()

  const getColorName = (color?: string) => {
    if (!color) return ""
    const colorNames: { [key: string]: string } = {
      "#000000": "Black",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#0000FF": "Blue",
      "#008000": "Green",
      "#8B4513": "Brown",
      "#FF69B4": "Pink",
      "#FFD700": "Gold",
      "#C0C0C0": "Silver",
      "#006400": "Dark Green",
    }
    return colorNames[color] || "Color"
  }

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity)
  }

  const handleRemoveItem = (cartItem: CartItem) => {
    Alert.alert(
      "Remove Item",
      `Remove ${cartItem.deal.title} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeFromCart(cartItem.id) },
      ]
    )
  }

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearCart },
      ]
    )
  }

  const handleCheckout = () => {
    Alert.alert(
      "Proceed to Checkout",
      `Total: $${getCartTotal().toFixed(2)}\n${getCartItemsCount()} items`,
      [
        { text: "Continue Shopping", onPress: onContinueShopping },
        { text: "Checkout", style: "default" },
      ]
    )
  }

  const renderCartItem = (item: CartItem) => {
    const itemTotal = parseFloat(item.deal.salePrice.replace('$', '')) * item.quantity

    return (
      <View key={item.id} style={styles.cartItem}>
        <Image source={{ uri: item.deal.image }} style={styles.itemImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.deal.title}
          </Text>
          
          {item.deal.brand && (
            <Text style={styles.itemBrand}>by {item.deal.brand}</Text>
          )}
          
          <View style={styles.itemOptions}>
            {item.selectedColor && (
              <View style={styles.optionContainer}>
                <View 
                  style={[
                    styles.colorDot, 
                    { backgroundColor: item.selectedColor },
                    item.selectedColor === '#FFFFFF' && styles.whiteColorDot
                  ]} 
                />
                <Text style={styles.optionText}>{getColorName(item.selectedColor)}</Text>
              </View>
            )}
            
            {item.selectedSize && (
              <View style={styles.optionContainer}>
                <Text style={styles.sizeText}>Size: {item.selectedSize}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{item.deal.salePrice}</Text>
            <Text style={styles.originalPrice}>{item.deal.originalPrice}</Text>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity 
            onPress={() => handleRemoveItem(item)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </TouchableOpacity>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              style={[styles.quantityButton, item.quantity === 1 && styles.disabledButton]}
              disabled={item.quantity === 1}
            >
              <Ionicons name="remove" size={16} color={item.quantity === 1 ? "#ccc" : "#333"} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.itemTotal}>${itemTotal.toFixed(2)}</Text>
        </View>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={styles.headerButton} />
        </View>

        {/* Empty Cart */}
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>Add some amazing deals to get started!</Text>
          <TouchableOpacity style={styles.continueButton} onPress={onContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart ({getCartItemsCount()})</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cartItems}>
          {cartItems.map(renderCartItem)}
        </View>
        
        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({getCartItemsCount()} items)</Text>
            <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {getCartTotal() >= 50 ? "FREE" : "$9.99"}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${(getCartTotal() * 0.08).toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(getCartTotal() + (getCartTotal() >= 50 ? 0 : 9.99) + (getCartTotal() * 0.08)).toFixed(2)}
            </Text>
          </View>
          
          {getCartTotal() < 50 && (
            <View style={styles.freeShippingNotice}>
              <Ionicons name="information-circle-outline" size={16} color="#666" />
              <Text style={styles.freeShippingText}>
                Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.continueShoppingButton} onPress={onContinueShopping}>
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  cartItems: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  itemOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  whiteColorDot: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 12,
    color: "#666",
  },
  sizeText: {
    fontSize: 12,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4444",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  removeButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  summaryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4444",
  },
  freeShippingNotice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
    backgroundColor: "#e8f5e8",
    borderRadius: 4,
  },
  freeShippingText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  continueShoppingButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default CartPage
