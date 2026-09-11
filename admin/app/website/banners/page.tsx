'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { Banner } from '@shared/types';
import { ImageUploadInput } from '../../../components/ImageUploadInput';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    mobileImageUrl: '',
    linkUrl: '/shop',
    ctaText: 'Explore Now',
    position: 'middle' as 'hero' | 'top' | 'middle' | 'bottom' | 'popup',
    displayOrder: 1,
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getBanners();
      if (res.success && res.banners) {
        setBanners(res.banners);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: 'Handloom Heritage Sale',
      subtitle: 'Up to 30% Off on Selected Banarasi Silk',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
      mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=720&auto=format&fit=crop',
      linkUrl: '/shop?category=sarees',
      ctaText: 'Shop Sarees',
      position: 'middle',
      displayOrder: banners.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      imageUrl: b.imageUrl,
      mobileImageUrl: b.mobileImageUrl || '',
      linkUrl: b.linkUrl || '/shop',
      ctaText: b.ctaText || 'Shop Now',
      position: b.position || 'middle',
      displayOrder: b.displayOrder || 1,
      isActive: b.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      alert('Title and Image URL are required.');
      return;
    }

    try {
      if (editingBanner) {
        const res = await adminApi.updateBanner(editingBanner._id, formData);
        if (res.success) {
          fetchBanners();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error updating banner');
        }
      } else {
        const res = await adminApi.createBanner(formData);
        if (res.success) {
          fetchBanners();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error creating banner');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    try {
      const res = await adminApi.deleteBanner(id);
      if (res.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
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
            <ImageIcon className="w-7 h-7 text-emerald-400" />
            <span>Promotional Banners CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control promotional strips, homepage dividers, and flash campaign announcements
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Banner</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Promotional Banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Banners Configured</h3>
          <p className="text-xs text-slate-400 mt-1">Add your first promotional strip or homepage campaign banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div className="relative h-48 w-full bg-slate-950">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40 uppercase">
                    {banner.position}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-slate-300">
                    Order #{banner.displayOrder}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-bold text-white text-base leading-snug">{banner.title}</h3>
                  {banner.subtitle && <p className="text-xs text-slate-300 line-clamp-1">{banner.subtitle}</p>}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-slate-300">
                <span>
                  CTA: <strong className="text-white">{banner.ctaText}</strong> → {banner.linkUrl}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    banner.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="px-4 py-2.5 border-t border-slate-700/60 bg-slate-900/40 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner._id, banner.title)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-[#1C2541] border border-[#3A506B] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-white">
                {editingBanner ? 'Edit Banner' : 'New Promotional Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Subtitle / Promo Text</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <ImageUploadInput
                label="Desktop Image URL"
                required
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                placeholder="Paste URL or upload desktop banner..."
              />

              <ImageUploadInput
                label="Mobile Image URL"
                value={formData.mobileImageUrl}
                onChange={(url) => setFormData({ ...formData, mobileImageUrl: url })}
                placeholder="Paste URL or upload mobile banner (optional)..."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Placement Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  >
                    <option value="top">Top Announcement</option>
                    <option value="middle">Middle Body Divider</option>
                    <option value="bottom">Bottom Footer Pre-banner</option>
                    <option value="popup">Popup Modal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-slate-900"
                  />
                  <span>Active & Published</span>
                </label>
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
                  <span>{editingBanner ? 'Update Banner' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
