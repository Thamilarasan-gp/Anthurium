import mongoose, { Schema, Document } from 'mongoose';

export interface ICollectionDocument extends Document {
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  displayOrder: number;
  featured?: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollectionDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    bannerImage: { type: String },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Collection = mongoose.model<ICollectionDocument>('Collection', CollectionSchema);
