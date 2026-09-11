export type Role = 'customer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  addresses?: Address[];
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile extends User {
  addresses: Address[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  featured?: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  displayOrder: number;
  featured?: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductBadge = 'New' | 'Trending' | 'Bestseller' | 'Limited' | 'Sale';

export interface ProductVariant {
  _id?: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
  sku: string;
  price?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category | string;
  collections?: (Collection | string)[];
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  sku: string;
  images: string[];
  videoUrl?: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  careInstructions?: string;
  fit?: string;
  stock: number;
  badges?: ProductBadge[];
  featured?: boolean;
  bestseller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  status: 'active' | 'draft';
  rating?: number;
  numReviews?: number;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: (Product | string)[];
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod' | 'upi' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  _id?: string;
  product: Product | string;
  productTitle: string;
  productImage: string;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string | User;
  guestCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  courierName?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroAudioTrack {
  title: string;
  subtitle?: string;
  audioUrl: string;
  thumbnailUrl: string;
  waveformUrl?: string;
}

export interface HeroSection {
  _id: string;
  heading: string;
  highlightedHeading?: string;
  supportingText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  audioTrack?: HeroAudioTrack;
  sideText?: string;
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  _id: string;
  title: string;
  caption?: string;
  instagramUrl?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  linkedProducts: (Product | string)[];
  category?: string;
  featured?: boolean;
  isActive: boolean;
  displayOrder: number;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LookbookHotspot {
  x: number; // percentage from left
  y: number; // percentage from top
  product: Product | string;
  title?: string;
}

export interface Lookbook {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  storyQuote?: string;
  hotspots: LookbookHotspot[];
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mood {
  _id: string;
  name: string; // e.g. 'Morning', 'Everyday', 'Festive', 'Wedding', 'Weekend', 'Celebration', 'Soft', 'Traditional'
  tagline: string;
  audioUrl: string;
  bgImageUrl: string;
  themeColor: string;
  products: (Product | string)[];
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: Product | string;
  user: User | string;
  customerName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreConfig {
  storeId: string;
  brandName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  bgIvory: string;
  fontSerif: string;
  fontSans: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    youtube?: string;
  };
  currency: {
    code: string;
    symbol: string;
  };
  taxRate: number;
  freeShippingThreshold: number;
  shippingFee: number;
  codEnabled: boolean;
  codFee: number;
  announcementBarText?: string;
}

export interface WebsiteSettings extends StoreConfig {
  _id: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  ctaText?: string;
  position: 'hero' | 'top' | 'middle' | 'bottom' | 'popup';
  isActive: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

