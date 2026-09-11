'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { HeroSection } from '@shared/types';
import { ImageUploadInput } from '../../../components/ImageUploadInput';
import { AudioUploadInput } from '../../../components/AudioUploadInput';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Music,
  Eye,
  Check,
  X,
  Loader2,
  Save,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminHeroCMSPage() {
  const [slides, setSlides] = useState<HeroSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSection | null>(null);

  const [formData, setFormData] = useState({
    heading: '',
    highlightedHeading: '',
    supportingText: '',
    primaryCtaText: 'Explore Collection',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'Discover Lookbook',
    secondaryCtaLink: '/lookbook',
    desktopImageUrl: '',
    mobileImageUrl: '',
    videoUrl: '',
    sideText: 'NEW BOUTIQUE EDIT • 2026',
    displayOrder: 1,
    isActive: true,
    audioTrack: {
      title: 'Boutique Morning Raga',
      subtitle: 'Soft Sitar & Flute Ambience',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impromptu-01-112197.mp3',
      thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop'
    }
  });

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getHeroSlides();
      const slidesList = res.heroSections || res.heroes;
      if (res.success && Array.isArray(slidesList)) {
        setSlides(slidesList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreateModal = () => {
    setEditingSlide(null);
    setFormData({
      heading: 'A Symphony of Pure Silk',
      highlightedHeading: 'Anthurium Festive Edit',
      supportingText: 'Handcrafted sarees and ensembles celebrating timeless elegance and modern silhouette.',
      primaryCtaText: 'Shop New Arrivals',
      primaryCtaLink: '/shop',
      secondaryCtaText: 'View Lookbook',
      secondaryCtaLink: '/lookbook',
      desktopImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=720&auto=format&fit=crop',
      videoUrl: '',
      sideText: 'HANDCRAFTED LUXURY • FASHION BLOOMS HERE',
      displayOrder: slides.length + 1,
      isActive: true,
      audioTrack: {
        title: 'Boutique Morning Raga',
        subtitle: 'Soft Sitar Ambience',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impromptu-01-112197.mp3',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop'
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSection) => {
    setEditingSlide(slide);
    setFormData({
      heading: slide.heading,
      highlightedHeading: slide.highlightedHeading || '',
      supportingText: slide.supportingText,
      primaryCtaText: slide.primaryCtaText,
      primaryCtaLink: slide.primaryCtaLink,
      secondaryCtaText: slide.secondaryCtaText || '',
      secondaryCtaLink: slide.secondaryCtaLink || '',
      desktopImageUrl: slide.desktopImageUrl,
      mobileImageUrl: slide.mobileImageUrl || '',
      videoUrl: slide.videoUrl || '',
      sideText: slide.sideText || '',
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
      audioTrack: {
        title: slide.audioTrack?.title || '',
        subtitle: slide.audioTrack?.subtitle || '',
        audioUrl: slide.audioTrack?.audioUrl || '',
        thumbnailUrl: slide.audioTrack?.thumbnailUrl || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading || !formData.desktopImageUrl) {
      alert('Heading and Desktop Image URL are required.');
      return;
    }

    try {
      if (editingSlide) {
        const res = await adminApi.updateHeroSlide(editingSlide._id, formData);
        if (res.success) {
          fetchSlides();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error updating hero slide');
        }
      } else {
        const res = await adminApi.createHeroSlide(formData);
        if (res.success) {
          fetchSlides();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error creating hero slide');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try {
      const res = await adminApi.deleteHeroSlide(id);
      if (res.success) {
        setSlides((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(res.message || 'Delete failed');
      }
    } catch (err: any) {
      alert(err.message || 'Delete error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Sparkles className="w-7 h-7 text-emerald-400" />
            <span>Storefront Hero CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage desktop/mobile campaign banners, typography, CTAs, and ambient audio tracks
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Hero Slide</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Hero Sections...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Hero Slides Defined</h3>
          <p className="text-xs text-slate-400 mt-1">Click "New Hero Slide" to add your primary campaign hero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-600 transition"
            >
              {/* Preview Banner */}
              <div className="relative h-56 w-full bg-slate-950">
                <img
                  src={slide.desktopImageUrl}
                  alt={slide.heading}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm">
                    Slide #{slide.displayOrder}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm ${
                      slide.isActive
                        ? 'bg-emerald-500/80 text-slate-950'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {slide.audioTrack?.title && (
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-emerald-400 backdrop-blur-sm">
                    <Music className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-[11px] font-medium">{slide.audioTrack.title}</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4">
                  {slide.highlightedHeading && (
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                      {slide.highlightedHeading}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-white text-xl leading-snug drop-shadow-md">
                    {slide.heading}
                  </h3>
                </div>
              </div>

              {/* Details & CTAs */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2">{slide.supportingText}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    CTA 1: <strong className="text-white">{slide.primaryCtaText}</strong> → {slide.primaryCtaLink}
                  </span>
                  {slide.secondaryCtaText && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                      CTA 2: <strong className="text-white">{slide.secondaryCtaText}</strong> → {slide.secondaryCtaLink}
                    </span>
                  )}
                </div>

                {slide.mobileImageUrl && (
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    📱 Mobile Image: {slide.mobileImageUrl}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-slate-700/60 bg-slate-900/30 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">ID: {slide._id.slice(-8)}</span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit Slide</span>
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hero Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1C2541] border border-[#3A506B] rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-white">
                {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Slide Heading *</label>
                  <input
                    type="text"
                    required
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Highlighted Eyebrow Text</label>
                  <input
                    type="text"
                    value={formData.highlightedHeading}
                    onChange={(e) => setFormData({ ...formData, highlightedHeading: e.target.value })}
                    placeholder="e.g. Anthurium Festive Edit"
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Supporting Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.supportingText}
                  onChange={(e) => setFormData({ ...formData, supportingText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              {/* Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadInput
                  label="Desktop Hero Image URL"
                  required
                  value={formData.desktopImageUrl}
                  onChange={(url) => setFormData({ ...formData, desktopImageUrl: url })}
                  placeholder="Paste URL or click upload..."
                />
                <ImageUploadInput
                  label="Mobile Hero Image URL"
                  value={formData.mobileImageUrl}
                  onChange={(url) => setFormData({ ...formData, mobileImageUrl: url })}
                  placeholder="Paste URL or click upload (Portrait)..."
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Primary CTA Label & URL</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.primaryCtaText}
                      onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                      placeholder="Shop Now"
                      className="px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.primaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                      placeholder="/shop"
                      className="px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Secondary CTA Label & URL</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.secondaryCtaText}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                      placeholder="Lookbook"
                      className="px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                    />
                    <input
                      type="text"
                      value={formData.secondaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                      placeholder="/lookbook"
                      className="px-2.5 py-1.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Audio Track Config */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Music className="w-4 h-4" />
                  <span>Ambient Boutique Audio Track</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Track Name</label>
                    <input
                      type="text"
                      value={formData.audioTrack.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audioTrack: { ...formData.audioTrack, title: e.target.value }
                        })
                      }
                      placeholder="e.g. Sitar Morning Raga"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Track Subtitle / Mood</label>
                    <input
                      type="text"
                      value={formData.audioTrack.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          audioTrack: { ...formData.audioTrack, subtitle: e.target.value }
                        })
                      }
                      placeholder="e.g. Soft Sitar & Flute Ambience"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <AudioUploadInput
                  label="Audio Track File / URL"
                  value={formData.audioTrack.audioUrl}
                  onChange={(url) =>
                    setFormData({
                      ...formData,
                      audioTrack: { ...formData.audioTrack, audioUrl: url }
                    })
                  }
                  placeholder="Paste MP3/WAV URL or click 'Upload Audio' to store on Cloudinary..."
                  description="Upload any .mp3, .wav, .m4a, or .ogg audio file (stored directly in Cloudinary)."
                />

                <ImageUploadInput
                  label="Audio Thumbnail / Cover Art"
                  value={formData.audioTrack.thumbnailUrl}
                  onChange={(url) =>
                    setFormData({
                      ...formData,
                      audioTrack: { ...formData.audioTrack, thumbnailUrl: url }
                    })
                  }
                  placeholder="Paste artwork URL or upload cover thumbnail..."
                />
              </div>

              {/* Ordering and Active Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-slate-900"
                    />
                    <span>Active on Customer Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingSlide ? 'Update Slide' : 'Publish Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
