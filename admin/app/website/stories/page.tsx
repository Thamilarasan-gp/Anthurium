'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { Story, Product } from '@shared/types';
import { ImageUploadInput } from '../../../components/ImageUploadInput';
import { Video, Plus, Edit2, Trash2, X, Loader2, Save, ExternalLink } from 'lucide-react';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    instagramUrl: '',
    mediaType: 'video' as 'image' | 'video',
    mediaUrl: '',
    thumbnailUrl: '',
    category: 'Sarees',
    featured: true,
    isActive: true,
    displayOrder: 1,
    linkedProducts: [] as string[]
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [storyRes, prodRes] = await Promise.all([
        adminApi.getStories(),
        adminApi.getProducts()
      ]);
      if (storyRes.success && storyRes.stories) setStories(storyRes.stories);
      if (prodRes.success && prodRes.products) setProducts(prodRes.products);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingStory(null);
    setFormData({
      title: 'Festive Drapes in Motion',
      caption: 'Pure tissue organza draping in golden sunlight ✨ #AnthuriumBoutique',
      instagramUrl: 'https://instagram.com/reel/...',
      mediaType: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-lights-39878-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
      category: 'Sarees',
      featured: true,
      isActive: true,
      displayOrder: stories.length + 1,
      linkedProducts: products.length > 0 ? [products[0]._id] : []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      caption: story.caption || '',
      instagramUrl: story.instagramUrl || '',
      mediaType: story.mediaType,
      mediaUrl: story.mediaUrl,
      thumbnailUrl: story.thumbnailUrl || '',
      category: story.category || 'Sarees',
      featured: story.featured ?? true,
      isActive: story.isActive,
      displayOrder: story.displayOrder,
      linkedProducts: (story.linkedProducts as any[])?.map((p) => (typeof p === 'object' ? p._id : p)) || []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.mediaUrl) {
      alert('Title and Media URL are required.');
      return;
    }

    try {
      if (editingStory) {
        const res = await adminApi.updateStory(editingStory._id, formData);
        if (res.success) {
          loadData();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Update failed');
        }
      } else {
        const res = await adminApi.createStory(formData);
        if (res.success) {
          loadData();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Creation failed');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete story "${title}"?`)) return;
    try {
      const res = await adminApi.deleteStory(id);
      if (res.success) {
        setStories((prev) => prev.filter((s) => s._id !== id));
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
            <Video className="w-7 h-7 text-emerald-400" />
            <span>Instagram / Stories CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage reel videos, swipeable stories, product tags & Instagram links
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Story / Reel</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Stories & Reels...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <Video className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Stories / Reels Configured</h3>
          <p className="text-xs text-slate-400 mt-1">Add Instagram reels or video showcases for the mobile experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              {/* Media Thumbnail */}
              <div className="relative h-64 w-full bg-slate-900">
                {story.thumbnailUrl || (story.mediaType === 'image' ? story.mediaUrl : '') ? (
                  <img
                    src={story.thumbnailUrl || story.mediaUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Video className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40">
                    {story.mediaType.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-slate-300">
                    #{story.displayOrder}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{story.title}</h3>
                  {story.caption && (
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{story.caption}</p>
                  )}
                </div>
              </div>

              <div className="p-3.5 space-y-2 text-xs text-slate-300">
                {story.instagramUrl && (
                  <a
                    href={story.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center space-x-1 text-[11px] truncate"
                  >
                    <span>View Instagram Reel</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                )}
                <p className="text-[11px] text-slate-400 font-mono">
                  Linked: {story.linkedProducts?.length || 0} product(s)
                </p>
              </div>

              <div className="p-3 border-t border-slate-700/60 flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    story.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {story.isActive ? 'Live' : 'Hidden'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(story)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(story._id, story.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                {editingStory ? 'Edit Story / Reel' : 'Add Story / Reel'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Story Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <ImageUploadInput
                label="Media URL (Video MP4 or Image)"
                required
                value={formData.mediaUrl}
                onChange={(url) => setFormData({ ...formData, mediaUrl: url })}
                placeholder="Paste URL or upload image/media file..."
              />

              <ImageUploadInput
                label="Thumbnail Preview Image"
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                placeholder="Paste URL or upload thumbnail preview..."
              />

              <div>
                <label className="block text-xs text-slate-300 mb-1">Instagram Post/Reel URL</label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/reel/..."
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Caption / Hashtags</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Media Type</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  >
                    <option value="video">Video (Reel)</option>
                    <option value="image">Image Post</option>
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
                  <span>Active & Visible on Customer Website</span>
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
                  <span>{editingStory ? 'Update Story' : 'Publish Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
