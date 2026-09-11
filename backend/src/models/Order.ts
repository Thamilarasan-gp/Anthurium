import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../../shared/types';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productTitle: string;
  productImage: string;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  guestCustomer?: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  courierName?: string;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  selectedColor: { name: String, hex: String },
  selectedSize: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestCustomer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String }
    },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod', 'upi', 'card'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded'
      ],
      default: 'confirmed'
    },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    notes: { type: String },
    trackingNumber: { type: String },
    courierName: { type: String },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
