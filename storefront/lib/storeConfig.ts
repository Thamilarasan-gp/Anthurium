import { StoreConfig } from '@shared/types';

export const defaultStoreConfig: StoreConfig = {
  storeId: 'anthurium-default',
  brandName: 'ANTHURIUM',
  tagline: 'FASHION BLOOMS HERE',
  logoUrl: '',
  primaryColor: '#2E4036',
  accentColor: '#E8C5C8',
  bgIvory: '#FAF7F2',
  fontSerif: 'Playfair Display',
  fontSans: 'Outfit',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'hello@anthuriumboutique.com',
  address: {
    street: '142, Race Course Road, Near Thomas Park',
    city: 'Namakkal',
    state: 'Tamil Nadu',
    pincode: '641018',
    country: 'India'
  },
  socialLinks: {
    instagram: 'https://instagram.com/anthurium.official',
    facebook: 'https://facebook.com/anthuriumboutique',
    pinterest: 'https://pinterest.com/anthuriumboutique',
    youtube: 'https://youtube.com/@anthuriumboutique'
  },
  currency: {
    code: 'INR',
    symbol: '₹'
  },
  taxRate: 0.05,
  freeShippingThreshold: 2999,
  shippingFee: 150,
  codEnabled: true,
  codFee: 99,
  announcementBarText: '✨ Free Express Shipping across India on orders above ₹2,999 | Handcrafted Festive Collection Live'
};
