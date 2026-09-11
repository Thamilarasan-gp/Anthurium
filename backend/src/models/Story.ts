import mongoose, { Schema, Document } from 'mongoose';

export interface IStoryDocument extends Document {
  title: string;
  caption?: string;
  instagramUrl?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  viewsCount?: number;
  likesCount?: number;
  linkedProducts: mongoose.Types.ObjectId[];
  category?: string;
  featured?: boolean;
  isActive: boolean;
  displayOrder: number;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStoryDocument>(
  {
    title: { type: String, required: true },
    caption: { type: String },
    instagramUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video'], default: 'video' },
    mediaUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    viewsCount: { type: Number, default: 12400 },
    likesCount: { type: Number, default: 1850 },
    linkedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    category: { type: String, default: 'Everyday Elegance' },
    featured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Story = mongoose.model<IStoryDocument>('Story', StorySchema);
