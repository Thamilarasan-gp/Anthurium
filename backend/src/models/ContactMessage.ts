import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessageDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' }
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model<IContactMessageDocument>('ContactMessage', ContactMessageSchema);
