export interface Deal {
    id: number
    image: string
    discount: string
    title: string
    originalPrice: string
    salePrice: string
    description: string
    rating: number
    reviews: number
    category?: string
    brand?: string
    inStock?: boolean
    colors?: string[]
    sizes?: string[]
  }
  
  export const dealsData: Deal[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
      discount: "50%",
      title: "Premium Fashion Collection",
      originalPrice: "$199.99",
      salePrice: "$99.99",
      description:
        "Discover our premium fashion collection with high-quality materials and modern designs. Perfect for any occasion. Made from sustainable fabrics with attention to detail.",
      rating: 4.8,
      reviews: 124,
      category: "Fashion",
      brand: "StyleCo",
      inStock: true,
      colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      discount: "75%",
      title: "Designer Handbag",
      originalPrice: "$399.99",
      salePrice: "$99.99",
      description:
        "Elegant designer handbag crafted from genuine leather. Spacious interior with multiple compartments for all your essentials.",
      rating: 4.9,
      reviews: 89,
      category: "Accessories",
      brand: "LuxeBag",
      inStock: true,
      colors: ["#8B4513", "#000000", "#FF69B4"],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1494976688153-c91c4d0c8b23?w=400&h=400&fit=crop",
      discount: "80%",
      title: "Luxury Car Experience",
      originalPrice: "$2,999.99",
      salePrice: "$599.99",
      description:
        "Experience luxury with our premium car rental service. Perfect for special occasions and business trips. Includes full insurance coverage.",
      rating: 4.7,
      reviews: 45,
      category: "Automotive",
      brand: "LuxeDrive",
      inStock: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      discount: "80%",
      title: "Premium Sneakers",
      originalPrice: "$299.99",
      salePrice: "$59.99",
      description:
        "Comfortable and stylish sneakers perfect for everyday wear. Made with breathable materials and advanced cushioning.",
      rating: 4.6,
      reviews: 203,
      category: "Footwear",
      brand: "SportMax",
      inStock: true,
      colors: ["#FFFFFF", "#000000", "#FF0000"],
      sizes: ["7", "8", "9", "10", "11", "12"],
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
      discount: "75%",
      title: "Elegant Dress",
      originalPrice: "$159.99",
      salePrice: "$39.99",
      description:
        "Beautiful elegant dress perfect for formal events and special occasions. Available in multiple sizes with flattering silhouette.",
      rating: 4.8,
      reviews: 156,
      category: "Fashion",
      brand: "ElegantWear",
      inStock: true,
      colors: ["#000000", "#FF69B4", "#0000FF"],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
      discount: "20%",
      title: "Luxury Watch",
      originalPrice: "$499.99",
      salePrice: "$399.99",
      description:
        "Sophisticated luxury watch with precision movement. Water-resistant and comes with warranty. Features sapphire crystal glass.",
      rating: 4.9,
      reviews: 78,
      category: "Accessories",
      brand: "TimeElite",
      inStock: true,
      colors: ["#C0C0C0", "#FFD700", "#000000"],
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
      discount: "80%",
      title: "Winter Jacket",
      originalPrice: "$249.99",
      salePrice: "$49.99",
      description:
        "Warm and comfortable winter jacket with premium insulation. Perfect for cold weather with water-resistant exterior.",
      rating: 4.7,
      reviews: 92,
      category: "Outerwear",
      brand: "WarmTech",
      inStock: true,
      colors: ["#000000", "#8B4513", "#006400"],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      discount: "75%",
      title: "Fashion Accessories",
      originalPrice: "$79.99",
      salePrice: "$19.99",
      description:
        "Complete your look with our stylish fashion accessories. High-quality materials and trendy designs that complement any outfit.",
      rating: 4.5,
      reviews: 167,
      category: "Accessories",
      brand: "TrendSet",
      inStock: true,
      colors: ["#FFD700", "#C0C0C0", "#FF69B4"],
    },
  ]
  
  export const findDealById = (id: number): Deal | undefined => {
    return dealsData.find((deal) => deal.id === id)
  }
  