import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteSettingsDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettingsDocument>(
  {
    storeId: { type: String, required: true, unique: true, default: 'anthurium-default' },
    brandName: { type: String, required: true, default: 'ANTHURIUM' },
    tagline: { type: String, required: true, default: 'FASHION BLOOMS HERE' },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    primaryColor: { type: String, default: '#2E4036' },
    accentColor: { type: String, default: '#E8C5C8' },
    bgIvory: { type: String, default: '#FAF7F2' },
    fontSerif: { type: String, default: 'Playfair Display' },
    fontSans: { type: String, default: 'Outfit' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsappNumber: { type: String, default: '919876543210' },
    email: { type: String, default: 'hello@anthuriumboutique.com' },
    address: {
      street: { type: String, default: '142, Race Course Road, Near Thomas Park' },
      city: { type: String, default: 'Coimbatore' },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, default: '641018' },
      country: { type: String, default: 'India' }
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/anthurium.official' },
      facebook: { type: String, default: 'https://facebook.com/anthuriumboutique' },
      pinterest: { type: String, default: 'https://pinterest.com/anthuriumboutique' },
      youtube: { type: String, default: 'https://youtube.com/@anthuriumboutique' }
    },
    currency: {
      code: { type: String, default: 'INR' },
      symbol: { type: String, default: '₹' }
    },
    taxRate: { type: Number, default: 0.05 },
    freeShippingThreshold: { type: Number, default: 2999 },
    shippingFee: { type: Number, default: 150 },
    codEnabled: { type: Boolean, default: true },
    codFee: { type: Number, default: 99 },
    announcementBarText: { type: String, default: '✨ Free Express Shipping across India on orders above ₹2,999 | Handcrafted Festive Collection Live' }
  },
  { timestamps: true }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettingsDocument>('WebsiteSettings', WebsiteSettingsSchema);
