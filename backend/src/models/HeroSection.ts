import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSectionDocument extends Document {
  heading: string;
  highlightedHeading?: string;
  supportingText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  audioTrack?: {
    title: string;
    subtitle?: string;
    audioUrl: string;
    thumbnailUrl: string;
    waveformUrl?: string;
  };
  sideText?: string;
  displayOrder: number;
  isActive: boolean;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSectionDocument>(
  {
    heading: { type: String, required: true },
    highlightedHeading: { type: String },
    supportingText: { type: String, required: true },
    primaryCtaText: { type: String, required: true, default: 'Explore Collection' },
    primaryCtaLink: { type: String, required: true, default: '/shop' },
    secondaryCtaText: { type: String, default: 'Play Our Story' },
    secondaryCtaLink: { type: String, default: '/lookbook' },
    desktopImageUrl: { type: String, required: true },
    mobileImageUrl: { type: String },
    videoUrl: { type: String },
    audioTrack: {
      title: { type: String, default: 'Anthurium Vibes' },
      subtitle: { type: String, default: 'Fashion Blooms Here' },
      audioUrl: { type: String },
      thumbnailUrl: { type: String },
      waveformUrl: { type: String }
    },
    sideText: { type: String, default: 'Good Outfits. Better Moods.' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    storeId: { type: String, default: 'anthurium-default' }
  },
  { timestamps: true }
);

export const HeroSection = mongoose.model<IHeroSectionDocument>('HeroSection', HeroSectionSchema);
