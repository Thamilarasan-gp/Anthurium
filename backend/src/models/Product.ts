import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: mongoose.Types.ObjectId;
  collections: mongoose.Types.ObjectId[];
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
  badges?: string[];
  featured?: boolean;
  bestseller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  status: 'active' | 'draft';
  rating: number;
  numReviews: number;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    sku: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    videoUrl: { type: String },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    sizes: [{ type: String }],
    fabric: { type: String, required: true },
    careInstructions: { type: String },
    fit: { type: String },
    stock: { type: Number, required: true, default: 10, min: 0 },
    badges: [{ type: String, enum: ['New', 'Trending', 'Bestseller', 'Limited', 'Sale'] }],
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'draft'], default: 'active' },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProductDocument>('Product', ProductSchema);
