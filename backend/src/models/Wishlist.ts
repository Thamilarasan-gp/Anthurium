import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema);
