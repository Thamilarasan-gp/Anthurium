import mongoose, { Schema, Document } from 'mongoose';

export interface ILookbookHotspot {
  x: number;
  y: number;
  product: mongoose.Types.ObjectId;
  title?: string;
}

export interface ILookbookDocument extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  storyQuote?: string;
  hotspots: ILookbookHotspot[];
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LookbookHotspotSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String }
});

const LookbookSchema = new Schema<ILookbookDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    imageUrl: { type: String, required: true },
    storyQuote: { type: String },
    hotspots: [LookbookHotspotSchema],
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Lookbook = mongoose.model<ILookbookDocument>('Lookbook', LookbookSchema);
