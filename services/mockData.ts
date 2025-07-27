import { Product, Review, SimilarProduct } from './productService';
import { Message, ChatRoom } from './chatService';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    title: "Women's Ribbed Tank Top",
    description: "Beautiful and comfortable ribbed tank top. Perfect for casual wear and special occasions. Made from high-quality cotton blend for maximum comfort.",
    price: 25.99,
    oldPrice: 35.99,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
    ],
    category: 'Clothing',
    seller: {
      id: 'seller1',
      name: 'Fashion Store',
      email: 'fashion@store.com',
      rating: 4.5
    },
    rating: 4.3,
    reviewCount: 128,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy', 'Pink'],
    condition: 'new',
    location: 'Accra, Ghana',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation. Perfect for music lovers and professionals. Long battery life and crystal clear sound quality.",
    price: 89.99,
    oldPrice: 129.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'
    ],
    category: 'Electronics',
    seller: {
      id: 'seller2',
      name: 'Tech Gadgets',
      email: 'tech@gadgets.com',
      rating: 4.8
    },
    rating: 4.7,
    reviewCount: 256,
    inStock: true,
    colors: ['Black', 'White', 'Blue'],
    condition: 'new',
    location: 'Kumasi, Ghana',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    title: "Handcrafted Wooden Bracelet",
    description: "Beautiful handcrafted wooden bracelet with intricate designs. Perfect gift for special occasions. Made from sustainable materials.",
    price: 15.50,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
    ],
    category: 'Jewelry',
    seller: {
      id: 'seller3',
      name: 'Artisan Crafts',
      email: 'artisan@crafts.com',
      rating: 4.2
    },
    rating: 4.1,
    reviewCount: 89,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Natural', 'Dark Brown', 'Light Brown'],
    condition: 'new',
    location: 'Cape Coast, Ghana',
    createdAt: '2024-01-20T09:15:00Z'
  }
];

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely love this product! The quality is amazing and it fits perfectly.',
    createdAt: '2024-01-25T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'John D.',
    rating: 4,
    comment: 'Great product, fast delivery. Would definitely recommend!',
    createdAt: '2024-01-24T15:45:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emma W.',
    rating: 5,
    comment: 'Perfect fit and excellent quality. Seller was very helpful with sizing questions.',
    createdAt: '2024-01-23T12:20:00Z'
  }
];

// Mock similar products
export const mockSimilarProducts: SimilarProduct[] = [
  {
    id: '4',
    title: "Casual Summer Dress",
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    rating: 4.2
  },
  {
    id: '5',
    title: "Denim Jacket",
    price: 65.50,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
    rating: 4.5
  },
  {
    id: '6',
    title: "Summer Blouse",
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
    rating: 4.0
  }
];

// Mock chat messages
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'seller1',
    receiverId: 'buyer1',
    content: 'Hi! Thanks for your interest in our product. How can I help you today?',
    timestamp: '2024-01-25T10:00:00Z',
    isRead: true
  },
  {
    id: '2',
    senderId: 'buyer1',
    receiverId: 'seller1',
    content: 'Hi! I was wondering if you have this in size M?',
    timestamp: '2024-01-25T10:05:00Z',
    isRead: true
  },
  {
    id: '3',
    senderId: 'seller1',
    receiverId: 'buyer1',
    content: 'Yes, we do have size M in stock! Would you like me to reserve it for you?',
    timestamp: '2024-01-25T10:07:00Z',
    isRead: false
  }
];

// Mock chat rooms
export const mockChatRooms: ChatRoom[] = [
  {
    id: 'chat1',
    productId: '1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 1,
    createdAt: '2024-01-25T10:00:00Z'
  }
];

// Helper functions to simulate API delays
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions that can be used when backend is not ready
export const mockGetProductDetails = async (productId: string): Promise<Product> => {
  await delay(1000); // Simulate network delay
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const mockGetProductReviews = async (productId: string): Promise<Review[]> => {
  await delay(800);
  return mockReviews;
};

export const mockGetSimilarProducts = async (productId: string): Promise<SimilarProduct[]> => {
  await delay(600);
  return mockSimilarProducts;
};

export const mockGetChatMessages = async (chatRoomId: string): Promise<Message[]> => {
  await delay(500);
  return mockMessages;
};

export const mockSendMessage = async (chatRoomId: string, content: string, senderId: string): Promise<Message> => {
  await delay(300);
  const newMessage: Message = {
    id: Date.now().toString(),
    senderId,
    receiverId: senderId === 'buyer1' ? 'seller1' : 'buyer1',
    content,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  return newMessage;
};

export const mockCreateChatRoom = async (productId: string, sellerId: string, buyerId: string): Promise<ChatRoom> => {
  await delay(500);
  const newChatRoom: ChatRoom = {
    id: `chat_${Date.now()}`,
    productId,
    buyerId,
    sellerId,
    unreadCount: 0,
    createdAt: new Date().toISOString()
  };
  return newChatRoom;
}; 