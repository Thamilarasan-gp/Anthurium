'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Collection } from '@shared/types';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { FolderKanban, Plus, Trash2, Edit2, X, Loader2, Save } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    bannerImage: '',
    displayOrder: 1,
    featured: true
  });

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getCollections();
      if (res.success && res.collections) {
        setCollections(res.collections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      bannerImage: '',
      displayOrder: collections.length + 1,
      featured: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setFormData({
      title: col.title,
      slug: col.slug,
      description: col.description || '',
      bannerImage: col.bannerImage || '',
      displayOrder: col.displayOrder || 1,
      featured: col.featured ?? true
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, title: val, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingCollection) {
        const res = await adminApi.updateCollection(editingCollection._id, formData);
        if (res.success) {
          fetchCollections();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error updating collection');
        }
      } else {
        const res = await adminApi.createCollection(formData);
        if (res.success) {
          fetchCollections();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error creating collection');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete collection "${title}"?`)) return;
    try {
      const res = await adminApi.deleteCollection(id);
      if (res.success) {
        setCollections((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(res.message || 'Failed to delete collection');
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
            <FolderKanban className="w-7 h-7 text-emerald-400" />
            <span>Curated Collections</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage thematic boutique edits (New Arrivals, Festive Edit, Wedding Stories, Everyday Elegance)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => (
            <div
              key={col._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div>
                {col.bannerImage ? (
                  <div className="h-36 w-full overflow-hidden relative">
                    <img src={col.bannerImage} alt={col.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-bold text-white text-lg drop-shadow-md">{col.title}</h3>
                      <p className="text-xs text-emerald-400 font-mono">/collections/{col.slug}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="font-bold text-white text-lg">{col.title}</h3>
                    <p className="text-xs text-emerald-400 font-mono">/collections/{col.slug}</p>
                  </div>
                )}

                <div className="p-4">
                  {col.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{col.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Order #{col.displayOrder}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(col)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(col._id, col.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#1C2541] border border-[#3A506B] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-white">
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Festive Edit 2026"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Collection story for lookbook banner..."
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
                />
              </div>

              <ImageUploadInput
                label="Cover Banner URL"
                value={formData.bannerImage}
                onChange={(url) => setFormData({ ...formData, bannerImage: url })}
                placeholder="Paste URL or upload collection cover banner..."
              />

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
                  <span>{editingCollection ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
