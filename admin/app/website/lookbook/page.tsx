'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/adminApi';
import { Lookbook, Product } from '@shared/types';
import { ImageUploadInput } from '../../../components/ImageUploadInput';
import { BookOpen, Plus, Edit2, Trash2, X, Loader2, Save, ShoppingBag } from 'lucide-react';

export default function AdminLookbookPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLookbook, setEditingLookbook] = useState<Lookbook | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    storyQuote: '',
    displayOrder: 1,
    isActive: true,
    hotspots: [] as any[]
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [lbRes, prodRes] = await Promise.all([
        adminApi.getLookbooks(),
        adminApi.getProducts()
      ]);
      if (lbRes.success && lbRes.lookbooks) setLookbooks(lbRes.lookbooks);
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
    setEditingLookbook(null);
    setFormData({
      title: 'The Royal Sovereign Drape',
      subtitle: 'Chapter I • Editorial Saree Showcase',
      description: 'Draped in hand-spun mulberry silk with temple motifs, designed for grand celebration.',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
      storyQuote: '“Fashion that whispers heritage and shouts contemporary grace.”',
      displayOrder: lookbooks.length + 1,
      isActive: true,
      hotspots: products.length > 0 ? [{ x: 50, y: 45, product: products[0]._id, title: 'Shop This Look' }] : []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lb: Lookbook) => {
    setEditingLookbook(lb);
    setFormData({
      title: lb.title,
      subtitle: lb.subtitle || '',
      description: lb.description || '',
      imageUrl: lb.imageUrl,
      storyQuote: lb.storyQuote || '',
      displayOrder: lb.displayOrder,
      isActive: lb.isActive,
      hotspots: lb.hotspots || []
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
      if (editingLookbook) {
        const res = await adminApi.updateLookbook(editingLookbook._id, formData);
        if (res.success) {
          loadData();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error updating lookbook');
        }
      } else {
        const res = await adminApi.createLookbook(formData);
        if (res.success) {
          loadData();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error creating lookbook');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete lookbook entry "${title}"?`)) return;
    try {
      const res = await adminApi.deleteLookbook(id);
      if (res.success) {
        setLookbooks((prev) => prev.filter((lb) => lb._id !== id));
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
            <BookOpen className="w-7 h-7 text-emerald-400" />
            <span>Lookbook & "Shop This Look" CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curate high-fashion editorial imagery with interactive product tag hotspots
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Lookbook Spread</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Lookbook Spreads...</p>
        </div>
      ) : lookbooks.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Lookbook Spreads Created</h3>
          <p className="text-xs text-slate-400 mt-1">Create an editorial look to enable "Shop This Look" on the storefront.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lookbooks.map((lb) => (
            <div
              key={lb._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div className="relative h-64 w-full bg-slate-900">
                <img src={lb.imageUrl} alt={lb.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/40">
                    Spread #{lb.displayOrder}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-serif font-bold text-white text-base leading-snug drop-shadow-md">
                    {lb.title}
                  </h3>
                  {lb.subtitle && <p className="text-xs text-amber-300 font-medium">{lb.subtitle}</p>}
                </div>
              </div>

              <div className="p-4 space-y-2">
                {lb.storyQuote && (
                  <p className="text-xs italic text-slate-300 border-l-2 border-emerald-500 pl-2.5 line-clamp-2">
                    {lb.storyQuote}
                  </p>
                )}
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400 pt-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lb.hotspots?.length || 0} Hotspot Product Tags</span>
                </div>
              </div>

              <div className="p-3 border-t border-slate-700/60 flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    lb.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {lb.isActive ? 'Active' : 'Draft'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(lb)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(lb._id, lb.title)}
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
                {editingLookbook ? 'Edit Lookbook Spread' : 'Add Lookbook Spread'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Spread Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Subtitle / Chapter</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <ImageUploadInput
                label="Editorial Image URL"
                required
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                placeholder="Paste URL or upload editorial lookbook image..."
              />

              <div>
                <label className="block text-xs text-slate-300 mb-1">Editorial Quote / Philosophy</label>
                <textarea
                  rows={2}
                  value={formData.storyQuote}
                  onChange={(e) => setFormData({ ...formData, storyQuote: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
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
                    <span>Active on Website</span>
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
                  <span>{editingLookbook ? 'Update Spread' : 'Publish Spread'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
