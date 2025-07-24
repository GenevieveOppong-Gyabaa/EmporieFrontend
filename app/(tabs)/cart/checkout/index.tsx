"use client"

import { useCart } from "@/context/cartContext"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useState } from "react"
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

interface CheckoutPageProps {
  onBack: () => void
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
  const { cartItems, getCartTotal, clearCart, removeFromCart } = useCart()
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

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

  const calculateSubtotal = () => {
    return getCartTotal()
  }

  const calculateShipping = () => {
    return getCartTotal() >= 50 ? 0 : 9.99
  }

  const calculateTax = () => {
    return getCartTotal() * 0.08
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const handleRemoveItem = (cartItem: any) => {
    Alert.alert(
      "Remove Item",
      `Remove ${cartItem.deal.title} from your order?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeFromCart(cartItem.id) },
      ]
    )
  }

  const handlePlaceOrder = () => {
    // Validate required fields
    const requiredShippingFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']
    const requiredPaymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName']
    
    const missingShipping = requiredShippingFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo])
    const missingPayment = requiredPaymentFields.filter(field => !paymentInfo[field as keyof typeof paymentInfo])
    
    if (missingShipping.length > 0 || missingPayment.length > 0) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields before placing your order.",
        [{ text: "OK" }]
      )
      return
    }

    Alert.alert(
      "Order Confirmed! 🎉",
      `Your order has been placed successfully!\n\nOrder Total: $${calculateTotal().toFixed(2)}\n\nYou will receive an email confirmation shortly.`,
      [
        { 
          text: "Continue Shopping", 
          onPress: () => {
            clearCart()
            router.push("/")
          }
        }
      ]
    )
  }

  const renderOrderItem = (item: any) => {
    const itemTotal = parseFloat(item.deal.salePrice.replace('$', '')) * item.quantity

    return (
      <View key={item.id} style={styles.orderItem}>
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
          
          <View style={styles.itemPriceRow}>
            <Text style={styles.itemPrice}>{item.deal.salePrice} × {item.quantity}</Text>
            <Text style={styles.itemTotal}>${itemTotal.toFixed(2)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleRemoveItem(item)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>Add some items to your cart to checkout!</Text>
          <TouchableOpacity style={styles.continueButton} onPress={() => router.push("/")}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : ''} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderItems}>
            {cartItems.map(renderOrderItem)}
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.formRow}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.firstName}
                onChangeText={(text) => setShippingInfo({...shippingInfo, firstName: text})}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.lastName}
                onChangeText={(text) => setShippingInfo({...shippingInfo, lastName: text})}
                placeholder="Enter last name"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              value={shippingInfo.email}
              onChangeText={(text) => setShippingInfo({...shippingInfo, email: text})}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={shippingInfo.phone}
              onChangeText={(text) => setShippingInfo({...shippingInfo, phone: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={styles.textInput}
              value={shippingInfo.address}
              onChangeText={(text) => setShippingInfo({...shippingInfo, address: text})}
              placeholder="Enter street address"
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.city}
                onChangeText={(text) => setShippingInfo({...shippingInfo, city: text})}
                placeholder="Enter city"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.state}
                onChangeText={(text) => setShippingInfo({...shippingInfo, state: text})}
                placeholder="Enter state"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ZIP Code *</Text>
            <TextInput
              style={styles.textInput}
              value={shippingInfo.zipCode}
              onChangeText={(text) => setShippingInfo({...shippingInfo, zipCode: text})}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name *</Text>
            <TextInput
              style={styles.textInput}
              value={paymentInfo.cardholderName}
              onChangeText={(text) => setPaymentInfo({...paymentInfo, cardholderName: text})}
              placeholder="Enter cardholder name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number *</Text>
            <TextInput
              style={styles.textInput}
              value={paymentInfo.cardNumber}
              onChangeText={(text) => setPaymentInfo({...paymentInfo, cardNumber: text})}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Expiry Date *</Text>
              <TextInput
                style={styles.textInput}
                value={paymentInfo.expiryDate}
                onChangeText={(text) => setPaymentInfo({...paymentInfo, expiryDate: text})}
                placeholder="MM/YY"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>CVV *</Text>
              <TextInput
                style={styles.textInput}
                value={paymentInfo.cvv}
                onChangeText={(text) => setPaymentInfo({...paymentInfo, cvv: text})}
                placeholder="123"
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${calculateSubtotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>
              {calculateShipping() === 0 ? "FREE" : `$${calculateShipping().toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>${calculateTax().toFixed(2)}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.finalTotalRow]}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.placeOrderText}>Place Order</Text>
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  orderItems: {
    gap: 12,
  },
  orderItem: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    position: "relative",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,

  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  itemOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  whiteColorDot: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 10,
    color: "#666",
  },
  sizeText: {
    fontSize: 10,
    color: "#666",
  },
  itemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 12,
    color: "#666",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  finalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4444",
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  placeOrderButton: {
    backgroundColor: "#ff4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default CheckoutPage 