'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '../../../lib/adminApi';
import { Category, Collection, Product } from '@shared/types';
import { ImageUploadInput } from '../../../components/ImageUploadInput';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '10',
    fabric: '',
    fit: '',
    careInstructions: '',
    status: 'active',
    images: [''],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [catRes, colRes, prodRes] = await Promise.all([
          adminApi.getCategories(),
          adminApi.getCollections(),
          adminApi.getProductById(productId)
        ]);

        if (catRes.success && catRes.categories) setCategories(catRes.categories);
        if (colRes.success && colRes.collections) setCollections(colRes.collections);

        if (prodRes.success && prodRes.product) {
          const p = prodRes.product;
          setFormData({
            title: p.title || '',
            slug: p.slug || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            category: typeof p.category === 'object' && p.category ? (p.category as any)._id : p.category || '',
            price: String(p.price || ''),
            salePrice: p.salePrice ? String(p.salePrice) : '',
            sku: p.sku || '',
            stock: String(p.stock ?? 10),
            fabric: p.fabric || '',
            fit: p.fit || '',
            careInstructions: p.careInstructions || '',
            status: p.status || 'active',
            images: p.images && p.images.length > 0 ? p.images : [''],
          });
        } else {
          setErrorMsg('Product could not be loaded.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading product.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [productId]);

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title || !formData.price || !formData.category) {
      setErrorMsg('Please fill in Title, Price, and select a Category.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        images: formData.images.filter((img) => img.trim().length > 0)
      };

      const res = await adminApi.updateProduct(productId, payload);
      if (res.success) {
        router.push('/products');
      } else {
        setErrorMsg(res.message || 'Error updating product.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
        <p className="text-sm">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            href="/products"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Product</h1>
            <p className="text-xs text-slate-400">Update style information, inventory & imagery</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Full Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
            />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Pricing & Organization</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Regular Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Product Imagery URLs</h2>
            <button
              type="button"
              onClick={addImageField}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="flex-1">
                  <ImageUploadInput
                    value={img}
                    onChange={(url) => handleImageChange(idx, url)}
                    placeholder="Paste image URL or click upload..."
                  />
                </div>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-slate-400 hover:text-rose-400 self-center"
                    title="Remove this image slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Update Product</span>
          </button>
        </div>
      </form>
    </div>
  );
}
