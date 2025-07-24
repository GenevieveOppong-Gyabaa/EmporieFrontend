"use client"

import { useCart } from "@/context/cartContext"
import { findDealById } from "@/data/deals"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useLocalSearchParams } from "expo-router/build/hooks"
import type React from "react"
import { useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const { width } = Dimensions.get("window")

interface SingleDealPageProps {
  dealId: number
  onBack: () => void
}

const SingleDealPage: React.FC<SingleDealPageProps> = () => {
    const {dealId} = useLocalSearchParams()
  const deal = findDealById(+(dealId as string))
  const { addToCart } = useCart()

  const [selectedColor, setSelectedColor] = useState(deal?.colors?.[0] || "#000000")
  const [selectedSize, setSelectedSize] = useState(deal?.sizes?.[0] || "M")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  // If deal not found, show error message
  if (!deal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Back to Deals</Text>
          </TouchableOpacity>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle-outline" size={64} color="#999" />
            <Text style={styles.errorTitle}>Deal Not Found</Text>
            <Text style={styles.errorMessage}>Sorry, we couldn&apos;t find the deal you&apos;re looking for.</Text>
            <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
              <Text style={styles.errorButtonText}>Browse Other Deals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />)
    }

    return stars
  }

  const handleAddToCart = () => {
    if (!deal) return
    
    addToCart(deal, quantity, selectedColor, selectedSize)
    
    Alert.alert("Added to Cart! 🛒", `${deal.title} has been added to your cart!`, [
      { text: "Continue Shopping", onPress: () => router.back() },
      { text: "View Cart", style: "default" , onPress:() => router.push("../cart")  },
    ])
  }

  const handleBuyNow = () => {
    if (!deal) return
    
    // Add item to cart first
    addToCart(deal, quantity, selectedColor, selectedSize)
    
    // Then navigate to checkout
    router.push("../cart/checkout")
  }

//   const handleShare = () => {
//     Alert.alert("Share Deal 📤", `Share this amazing ${deal.discount} off deal on ${deal.title}!`)
//   }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    Alert.alert(
      isFavorite ? "Removed from Favorites 💔" : "Added to Favorites ❤️",
      isFavorite ? `${deal.title} removed from your wishlist` : `${deal.title} saved to your wishlist`,
    )
  }

  const calculateSavings = () => {
    const original = Number.parseFloat(deal.originalPrice.replace("$", ""))
    const sale = Number.parseFloat(deal.salePrice.replace("$", ""))
    return (original - sale).toFixed(2)
  }

  const calculateTotal = () => {
    const price = Number.parseFloat(deal.salePrice.replace("$", ""))
    return `$${(price * quantity).toFixed(2)}`
  }

  const getColorName = (color: string) => {
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

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back to Deals</Text>
        </TouchableOpacity>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: deal.image }} style={styles.productImage} />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{deal.discount}</Text>
            <Text style={styles.offText}>OFF</Text>
          </View>
          {deal.inStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>✓ In Stock</Text>
            </View>
          )}
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ff4444" : "#fff"} />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Category & Brand */}
          {(deal.category || deal.brand) && (
            <View style={styles.categoryContainer}>
              {deal.category && <Text style={styles.categoryText}>{deal.category}</Text>}
              {deal.brand && <Text style={styles.brandText}>by {deal.brand}</Text>}
            </View>
          )}

          <Text style={styles.productTitle}>{deal.title}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars(deal.rating)}</View>
            <Text style={styles.ratingText}>{deal.rating}</Text>
            <Text style={styles.reviewsText}>({deal.reviews} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.salePrice}>{deal.salePrice}</Text>
              <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
            </View>
            <View style={styles.savingsContainer}>
              <Text style={styles.savingsText}>💰 You save ${calculateSavings()}</Text>
            </View>
          </View>

          {/* Color Selection */}
          {deal.colors && deal.colors.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Color: {getColorName(selectedColor)}</Text>
              <View style={styles.colorOptions}>
                {deal.colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption,
                      color === "#FFFFFF" && styles.whiteColorBorder,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={20} color={color === "#FFFFFF" ? "#333" : "#fff"} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {deal.sizes && deal.sizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Size: {selectedSize}</Text>
              <View style={styles.sizeOptions}>
                {deal.sizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.sizeOption, selectedSize === size && styles.selectedSizeOption]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.optionSection}>
            <Text style={styles.optionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={[styles.quantityButton, quantity === 1 && styles.disabledButton]}
                disabled={quantity === 1}
              >
                <Ionicons name="remove" size={20} color={quantity === 1 ? "#ccc" : "#333"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                <Ionicons name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>📝 Description</Text>
            <Text style={styles.descriptionText}>{deal.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>✨ What&apos;s Included</Text>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Free shipping on orders over $50</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>30-day return policy</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>1-year warranty included</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>{calculateTotal()}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="bag-add" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Ionicons name="flash" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: "#f0f0f0",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  discountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  offText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stockBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  stockText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  productInfo: {
    padding: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  brandText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    lineHeight: 30,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: "#666",
  },
  priceSection: {
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  salePrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff4444",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  savingsContainer: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  savingsText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  optionSection: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedColorOption: {
    borderColor: "#333",
  },
  whiteColorBorder: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sizeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
  },
  selectedSizeOption: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  sizeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedSizeText: {
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  bottomActions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#361696",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  buyNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SingleDealPage