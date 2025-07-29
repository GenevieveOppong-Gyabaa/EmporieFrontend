
export const BACKEND_URL = 'http://10.30.23.136:8080';


export const API_ENDPOINTS = {
  BACKEND_URL: BACKEND_URL,
  REGISTER: `${BACKEND_URL}/auth/register`,
  LOGIN: `${BACKEND_URL}/auth/login`,
  FORGOT_PASSWORD: `${BACKEND_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BACKEND_URL}/auth/reset-password`,
  PRODUCTS: `${BACKEND_URL}/products`,
  TRENDING_PICKS: `${BACKEND_URL}/products/trending`,
  CATEGORIES: `${BACKEND_URL}/categories`,
  RECOMMENDED_CATEGORIES: `${BACKEND_URL}/categories/recommended`,
  CHAT: `${BACKEND_URL}/chat`,
  BECOME_SELLER: `${BACKEND_URL}/auth/become-seller`,
 
}; 