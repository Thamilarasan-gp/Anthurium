import mongoose, { Document, Schema } from 'mongoose';

export interface IBannerDocument extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  ctaText?: string;
  position: 'hero' | 'top' | 'middle' | 'bottom' | 'popup';
  isActive: boolean;
  displayOrder: number;
  startDate?: Date;
  endDate?: Date;
  storeId: string;
}

const bannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    mobileImageUrl: { type: String },
    linkUrl: { type: String, default: '/shop' },
    ctaText: { type: String, default: 'Shop Now' },
    position: {
      type: String,
      enum: ['hero', 'top', 'middle', 'bottom', 'popup'],
      default: 'middle'
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Banner = mongoose.model<IBannerDocument>('Banner', bannerSchema);
