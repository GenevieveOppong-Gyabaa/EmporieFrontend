// Backend configuration
export const BACKEND_URL = 'http://10.132.202.162:8080';

// API endpoints
export const API_ENDPOINTS = {
  REGISTER: `${BACKEND_URL}/auth/register`,
  LOGIN: `${BACKEND_URL}/auth/login`,
  PRODUCTS: `${BACKEND_URL}/products`,
  CHAT: `${BACKEND_URL}/chat`,
  BECOME_SELLER: `${BACKEND_URL}/auth/become-seller`,
  // Add more endpoints as needed
}; 