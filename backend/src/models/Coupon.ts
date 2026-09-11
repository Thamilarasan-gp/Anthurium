import mongoose, { Schema, Document } from 'mongoose';

export interface ICouponDocument extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    expiryDate: { type: Date },
    usageLimit: { type: Number, default: 1000 },
    timesUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICouponDocument>('Coupon', CouponSchema);
