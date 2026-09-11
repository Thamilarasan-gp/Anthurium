import mongoose, { Schema, Document } from 'mongoose';

export interface IMoodDocument extends Document {
  name: string;
  tagline: string;
  audioUrl: string;
  bgImageUrl: string;
  themeColor: string;
  products: mongoose.Types.ObjectId[];
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodSchema = new Schema<IMoodDocument>(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    audioUrl: { type: String, required: true },
    bgImageUrl: { type: String, required: true },
    themeColor: { type: String, default: '#2E4036' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Mood = mongoose.model<IMoodDocument>('Mood', MoodSchema);
