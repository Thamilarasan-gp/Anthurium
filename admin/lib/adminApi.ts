import {
  Product,
  Category,
  Collection,
  HeroSection,
  Story,
  Lookbook,
  Review,
  Coupon,
  Order,
  WebsiteSettings,
  Banner
} from '@shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAdminAPI<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; message?: string; [key: string]: any }> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
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
    if (!response.ok && !data.message) {
      data.message = `Request failed with status ${response.status}`;
    }
    return data;
  } catch (error: any) {
    console.warn(`Admin API call failed for ${endpoint}:`, error.message);
    return { success: false, message: error.message || 'Network error' };
  }
}

export const adminApi = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    return fetchAdminAPI('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  logout: async () => {
    return fetchAdminAPI('/auth/logout', { method: 'POST' });
  },
  getMe: async () => {
    return fetchAdminAPI('/auth/me');
  },

  // Analytics
  getAnalytics: async () => {
    return fetchAdminAPI('/admin/analytics');
  },

  // Products
  getProducts: async () => {
    return fetchAdminAPI<{ products: Product[] }>('/admin/products');
  },
  getProductById: async (id: string) => {
    return fetchAdminAPI<{ product: Product }>(`/admin/products/${id}`);
  },
  createProduct: async (productData: any) => {
    return fetchAdminAPI('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },
  updateProduct: async (id: string, productData: any) => {
    return fetchAdminAPI(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },
  deleteProduct: async (id: string) => {
    return fetchAdminAPI(`/admin/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Categories
  getCategories: async () => {
    return fetchAdminAPI<{ categories: Category[] }>('/admin/categories');
  },
  createCategory: async (data: any) => {
    return fetchAdminAPI('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateCategory: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteCategory: async (id: string) => {
    return fetchAdminAPI(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Collections
  getCollections: async () => {
    return fetchAdminAPI<{ collections: Collection[] }>('/admin/collections');
  },
  createCollection: async (data: any) => {
    return fetchAdminAPI('/admin/collections', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateCollection: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteCollection: async (id: string) => {
    return fetchAdminAPI(`/admin/collections/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders
  getOrders: async () => {
    return fetchAdminAPI<{ orders: Order[] }>('/admin/orders');
  },
  getOrderById: async (id: string) => {
    return fetchAdminAPI<{ order: Order }>(`/admin/orders/${id}`);
  },
  updateOrderStatus: async (id: string, status: string, trackingNumber?: string, courierName?: string) => {
    return fetchAdminAPI(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: status, trackingNumber, courierName })
    });
  },

  // Customers
  getCustomers: async () => {
    return fetchAdminAPI('/admin/customers');
  },
  getCustomerById: async (id: string) => {
    return fetchAdminAPI(`/admin/customers/${id}`);
  },

  // Inventory
  getInventory: async () => {
    return fetchAdminAPI('/admin/inventory');
  },
  updateStock: async (productId: string, stock: number, sku?: string) => {
    return fetchAdminAPI('/admin/inventory/quick-update', {
      method: 'POST',
      body: JSON.stringify({ productId, stock, sku })
    });
  },

  // Website CMS: Hero Slides
  getHeroSlides: async () => {
    return fetchAdminAPI<{ heroSections?: HeroSection[]; heroes?: HeroSection[] }>('/admin/hero');
  },
  createHeroSlide: async (data: any) => {
    return fetchAdminAPI('/admin/hero', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateHeroSlide: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/hero/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteHeroSlide: async (id: string) => {
    return fetchAdminAPI(`/admin/hero/${id}`, {
      method: 'DELETE'
    });
  },

  // Website CMS: Stories / Instagram
  getStories: async () => {
    return fetchAdminAPI<{ stories: Story[] }>('/admin/stories');
  },
  createStory: async (data: any) => {
    return fetchAdminAPI('/admin/stories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateStory: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteStory: async (id: string) => {
    return fetchAdminAPI(`/admin/stories/${id}`, {
      method: 'DELETE'
    });
  },

  // Website CMS: Lookbook
  getLookbooks: async () => {
    return fetchAdminAPI<{ lookbooks: Lookbook[] }>('/admin/lookbook');
  },
  createLookbook: async (data: any) => {
    return fetchAdminAPI('/admin/lookbook', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateLookbook: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/lookbook/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteLookbook: async (id: string) => {
    return fetchAdminAPI(`/admin/lookbook/${id}`, {
      method: 'DELETE'
    });
  },

  // Website CMS: Banners
  getBanners: async () => {
    return fetchAdminAPI<{ banners: Banner[] }>('/admin/banners');
  },
  createBanner: async (data: any) => {
    return fetchAdminAPI('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateBanner: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteBanner: async (id: string) => {
    return fetchAdminAPI(`/admin/banners/${id}`, {
      method: 'DELETE'
    });
  },

  // Reviews Moderation
  getReviews: async () => {
    return fetchAdminAPI<{ reviews: Review[] }>('/admin/reviews');
  },
  updateReviewStatus: async (id: string, status: string, featured?: boolean) => {
    return fetchAdminAPI(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, featured })
    });
  },
  deleteReview: async (id: string) => {
    return fetchAdminAPI(`/admin/reviews/${id}`, {
      method: 'DELETE'
    });
  },

  // Coupons
  getCoupons: async () => {
    return fetchAdminAPI<{ coupons: Coupon[] }>('/admin/coupons');
  },
  createCoupon: async (data: any) => {
    return fetchAdminAPI('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateCoupon: async (id: string, data: any) => {
    return fetchAdminAPI(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteCoupon: async (id: string) => {
    return fetchAdminAPI(`/admin/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  // Settings
  getSettings: async () => {
    return fetchAdminAPI<{ settings: WebsiteSettings }>('/admin/settings');
  },
  updateSettings: async (settingsData: Partial<WebsiteSettings>) => {
    return fetchAdminAPI('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  },

  // Image Upload (Cloudinary)
  uploadImage: async (fileOrBase64: File | string): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      let base64 = '';
      if (typeof fileOrBase64 === 'string') {
        base64 = fileOrBase64;
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }
      return fetchAdminAPI<{ url: string }>('/upload', {
        method: 'POST',
        body: JSON.stringify({ image: base64 })
      });
    } catch (err: any) {
      return { success: false, message: err.message || 'Image reading failed' };
    }
  },

  // Audio Upload (Cloudinary)
  uploadAudio: async (fileOrBase64: File | string): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      let base64 = '';
      if (typeof fileOrBase64 === 'string') {
        base64 = fileOrBase64;
      } else {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }
      return fetchAdminAPI<{ url: string }>('/upload/audio', {
        method: 'POST',
        body: JSON.stringify({ audio: base64 })
      });
    } catch (err: any) {
      return { success: false, message: err.message || 'Audio reading failed' };
    }
  }
};
