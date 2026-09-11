import {
  Product,
  Category,
  Collection,
  HeroSection,
  Story,
  Lookbook,
  Mood,
  Cart,
  Wishlist,
  Order,
  User,
  WebsiteSettings,
  Coupon,
  Review
} from '@shared/types';

function getApiBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();

// In-Memory Stale-While-Revalidate Cache
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  revalidateAfter: number;
}

const memoryCache = new Map<string, CacheEntry>();

// Cache durations (in ms)
const CACHE_CONFIG: Record<string, { ttl: number; revalidateAfter: number }> = {
  settings: { ttl: 10 * 60 * 1000, revalidateAfter: 60 * 1000 },
  categories: { ttl: 15 * 60 * 1000, revalidateAfter: 2 * 60 * 1000 },
  collections: { ttl: 15 * 60 * 1000, revalidateAfter: 2 * 60 * 1000 },
  hero: { ttl: 10 * 60 * 1000, revalidateAfter: 60 * 1000 },
  stories: { ttl: 10 * 60 * 1000, revalidateAfter: 60 * 1000 },
  lookbooks: { ttl: 15 * 60 * 1000, revalidateAfter: 2 * 60 * 1000 },
  moods: { ttl: 15 * 60 * 1000, revalidateAfter: 2 * 60 * 1000 },
  products: { ttl: 5 * 60 * 1000, revalidateAfter: 45 * 1000 },
};

function getCacheRule(endpoint: string) {
  // Never cache sensitive, user-specific, or transactional endpoints
  if (
    endpoint.includes('/auth') ||
    endpoint.includes('/cart') ||
    endpoint.includes('/wishlist') ||
    endpoint.includes('/orders') ||
    endpoint.includes('/payments') ||
    endpoint.includes('/coupons') ||
    endpoint.includes('/admin')
  ) {
    return null;
  }

  if (endpoint.startsWith('/settings')) return CACHE_CONFIG.settings;
  if (endpoint.startsWith('/categories')) return CACHE_CONFIG.categories;
  if (endpoint.startsWith('/collections')) return CACHE_CONFIG.collections;
  if (endpoint.startsWith('/hero')) return CACHE_CONFIG.hero;
  if (endpoint.startsWith('/stories')) return CACHE_CONFIG.stories;
  if (endpoint.startsWith('/lookbooks')) return CACHE_CONFIG.lookbooks;
  if (endpoint.startsWith('/moods')) return CACHE_CONFIG.moods;
  if (endpoint.startsWith('/products')) return CACHE_CONFIG.products;

  return null;
}

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; [key: string]: any }> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const cacheRule = isGet ? getCacheRule(endpoint) : null;
  const now = Date.now();

  // Check client-side memory cache for GET requests
  if (cacheRule && typeof window !== 'undefined') {
    const cached = memoryCache.get(endpoint);
    if (cached && (now - cached.timestamp < cached.ttl)) {
      // If data is slightly stale (exceeded revalidateAfter), revalidate in the background
      if (now - cached.timestamp > cached.revalidateAfter) {
        // Trigger background revalidation without blocking
        backgroundRevalidate(endpoint, options, cacheRule);
      }
      return { ...cached.data, _fromCache: true };
    }
  }

  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('anthurium_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
      const sessionId = localStorage.getItem('anthurium_session_id') || `sess_${Date.now()}`;
      localStorage.setItem('anthurium_session_id', sessionId);
      defaultHeaders['x-session-id'] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    });

    const data = await response.json();

    // Cache successful read response
    if (cacheRule && data.success && typeof window !== 'undefined') {
      memoryCache.set(endpoint, {
        data,
        timestamp: Date.now(),
        ttl: cacheRule.ttl,
        revalidateAfter: cacheRule.revalidateAfter
      });
    }

    return data;
  } catch (error: any) {
    console.warn(`API call failed for ${endpoint}:`, error.message);
    return { success: false, message: error.message };
  }
}

// Background revalidation for Stale-While-Revalidate
async function backgroundRevalidate(endpoint: string, options: RequestInit, cacheRule: { ttl: number; revalidateAfter: number }) {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('anthurium_token');
      if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
      const sessionId = localStorage.getItem('anthurium_session_id');
      if (sessionId) defaultHeaders['x-session-id'] = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    });
    const freshData = await response.json();
    if (freshData.success && typeof window !== 'undefined') {
      memoryCache.set(endpoint, {
        data: freshData,
        timestamp: Date.now(),
        ttl: cacheRule.ttl,
        revalidateAfter: cacheRule.revalidateAfter
      });
    }
  } catch {
    // Background revalidation failure can fail silently, existing cache remains
  }
}

export const api = {
  // Settings / Store Config
  getSettings: async (): Promise<{ success: boolean; settings?: WebsiteSettings }> => {
    return fetchAPI('/settings');
  },
  updateSettings: async (data: Partial<WebsiteSettings>) => {
    invalidateCache('/settings');
    return fetchAPI('/settings/admin', { method: 'PUT', body: JSON.stringify(data) });
  },

  // Auth (NEVER CACHED)
  register: async (payload: any) => {
    return fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  login: async (payload: any) => {
    return fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  logout: async () => {
    return fetchAPI('/auth/logout', { method: 'POST' });
  },
  getMe: async () => {
    return fetchAPI('/auth/me');
  },
  addAddress: async (address: any) => {
    return fetchAPI('/auth/addresses', { method: 'POST', body: JSON.stringify(address) });
  },

  // Products
  getProducts: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, String(params[key]));
      }
    });
    return fetchAPI(`/products?${query.toString()}`);
  },
  getProductBySlug: async (slug: string) => {
    return fetchAPI(`/products/slug/${slug}`);
  },
  createProduct: async (product: any) => {
    invalidateCache('/products');
    return fetchAPI('/products', { method: 'POST', body: JSON.stringify(product) });
  },
  updateProduct: async (id: string, product: any) => {
    invalidateCache('/products');
    return fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
  },
  deleteProduct: async (id: string) => {
    invalidateCache('/products');
    return fetchAPI(`/products/${id}`, { method: 'DELETE' });
  },

  // Categories & Collections
  getCategories: async () => {
    return fetchAPI('/categories');
  },
  getCollections: async () => {
    return fetchAPI('/collections');
  },
  getCollectionBySlug: async (slug: string) => {
    return fetchAPI(`/collections/slug/${slug}`);
  },

  // Hero & Stories
  getHeroSections: async () => {
    return fetchAPI('/hero');
  },
  getAllHeroAdmin: async () => {
    return fetchAPI('/hero/admin/all');
  },
  createHero: async (hero: any) => {
    invalidateCache('/hero');
    return fetchAPI('/hero', { method: 'POST', body: JSON.stringify(hero) });
  },
  updateHero: async (id: string, hero: any) => {
    invalidateCache('/hero');
    return fetchAPI(`/hero/${id}`, { method: 'PUT', body: JSON.stringify(hero) });
  },
  deleteHero: async (id: string) => {
    invalidateCache('/hero');
    return fetchAPI(`/hero/${id}`, { method: 'DELETE' });
  },

  getStories: async () => {
    return fetchAPI('/stories');
  },
  createStory: async (story: any) => {
    invalidateCache('/stories');
    return fetchAPI('/stories', { method: 'POST', body: JSON.stringify(story) });
  },
  updateStory: async (id: string, story: any) => {
    invalidateCache('/stories');
    return fetchAPI(`/stories/${id}`, { method: 'PUT', body: JSON.stringify(story) });
  },

  // Lookbooks & Moods
  getLookbooks: async () => {
    return fetchAPI('/lookbooks');
  },
  getMoods: async () => {
    return fetchAPI('/moods');
  },

  // Wishlist (Separate Model Endpoint - NEVER CACHED)
  getWishlist: async () => {
    return fetchAPI('/wishlist');
  },
  toggleWishlist: async (productId: string) => {
    return fetchAPI('/wishlist/toggle', { method: 'POST', body: JSON.stringify({ productId }) });
  },
  removeFromWishlist: async (productId: string) => {
    return fetchAPI(`/wishlist/${productId}`, { method: 'DELETE' });
  },

  // Cart (NEVER CACHED)
  getCart: async () => {
    return fetchAPI('/cart');
  },
  addToCart: async (payload: { productId: string; selectedColor?: any; selectedSize?: string; quantity: number }) => {
    return fetchAPI('/cart', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateCartItem: async (itemId: string, quantity: number) => {
    return fetchAPI(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
  },
  removeCartItem: async (itemId: string) => {
    return fetchAPI(`/cart/items/${itemId}`, { method: 'DELETE' });
  },

  // Coupons (NEVER CACHED)
  validateCoupon: async (code: string, cartSubtotal: number) => {
    return fetchAPI('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, cartSubtotal }) });
  },

  // Orders (NEVER CACHED)
  createOrder: async (orderPayload: any) => {
    return fetchAPI('/orders', { method: 'POST', body: JSON.stringify(orderPayload) });
  },
  getMyOrders: async () => {
    return fetchAPI('/orders/my-orders');
  },
  linkOrder: async (orderNumber: string) => {
    return fetchAPI('/orders/link-order', { method: 'POST', body: JSON.stringify({ orderNumber }) });
  },
  trackOrder: async (orderNumber: string) => {
    return fetchAPI(`/orders/track/${orderNumber}`);
  },
  getAllOrdersAdmin: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/orders/admin/all?${query}`);
  },
  updateOrderStatusAdmin: async (id: string, payload: any) => {
    return fetchAPI(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  // Razorpay Payments (NEVER CACHED)
  createRazorpayOrder: async (orderId: string) => {
    return fetchAPI('/payments/razorpay/create-order', { method: 'POST', body: JSON.stringify({ orderId }) });
  },
  verifyRazorpayPayment: async (payload: any) => {
    return fetchAPI('/payments/razorpay/verify', { method: 'POST', body: JSON.stringify(payload) });
  },

  // Admin Analytics
  getAdminAnalytics: async () => {
    return fetchAPI('/admin/analytics');
  }
};

/**
 * Prefetches high-probability common data during browser idle time
 * Uses requestIdleCallback with safe setTimeout fallback so initial render is never blocked.
 */
let hasPrefetchedCommonData = false;

export function prefetchCommonData() {
  if (typeof window === 'undefined' || hasPrefetchedCommonData) return;
  hasPrefetchedCommonData = true;

  const scheduleIdle = typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback
    : (cb: () => void) => setTimeout(cb, 1200);

  scheduleIdle(async () => {
    try {
      // 1. Warm core taxonomy and collections
      await Promise.allSettled([
        api.getCategories(),
        api.getCollections(),
        api.getSettings(),
        api.getHeroSections()
      ]);

      // 2. Warm popular category listings with slight delay
      setTimeout(async () => {
        await Promise.allSettled([
          api.getProducts({ category: 'sarees', limit: 20 }),
          api.getProducts({ category: 'kurtis', limit: 20 }),
          api.getProducts({ category: 'dresses', limit: 20 }),
          api.getProducts({ category: 'sets', limit: 20 })
        ]);
      }, 1000);
    } catch {
      // Prefetching is purely an optimization; fail gracefully
    }
  });
}
