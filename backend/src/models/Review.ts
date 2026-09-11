import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    featured: { type: Boolean, default: false },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReviewDocument>('Review', ReviewSchema);
