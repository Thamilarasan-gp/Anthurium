export const DEFAULT_STORE_CONFIG = {
  storeId: 'anthurium-default',
  brandName: 'Anthurium',
  tagline: 'Fashion Blooms Here',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'care@anthurium.in',
  primaryColor: '#0B4A2B',
  accentColor: '#D8BE76',
  bgIvory: '#FAF7F2'
};

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
  'refunded'
] as const;

export const PRODUCT_BADGES = ['New', 'Trending', 'Bestseller', 'Limited', 'Sale'] as const;
