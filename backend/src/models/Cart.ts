import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  _id?: string;
  product: mongoose.Types.ObjectId;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface ICartDocument extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  selectedColor: {
    name: { type: String },
    hex: { type: String }
  },
  selectedSize: { type: String },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  price: { type: Number, required: true }
});

const CartSchema = new Schema<ICartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICartDocument>('Cart', CartSchema);
