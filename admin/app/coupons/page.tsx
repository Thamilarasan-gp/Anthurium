'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Coupon } from '@shared/types';
import { Tag, Plus, Trash2, Edit2, X, Loader2, Save, Percent, DollarSign } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderAmount: 2499,
    maxDiscountAmount: 1000,
    expiryDate: '',
    usageLimit: 500,
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getCoupons();
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: 'FESTIVE15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 2499,
      maxDiscountAmount: 1000,
      expiryDate: '',
      usageLimit: 500,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || 0,
      maxDiscountAmount: c.maxDiscountAmount || 0,
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '',
      usageLimit: c.usageLimit || 0,
      isActive: c.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      alert('Code and discount value are required.');
      return;
    }

    try {
      if (editingCoupon) {
        const res = await adminApi.updateCoupon(editingCoupon._id, {
          ...formData,
          code: formData.code.toUpperCase()
        });
        if (res.success) {
          fetchCoupons();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error updating coupon');
        }
      } else {
        const res = await adminApi.createCoupon({
          ...formData,
          code: formData.code.toUpperCase()
        });
        if (res.success) {
          fetchCoupons();
          setIsModalOpen(false);
        } else {
          alert(res.message || 'Error creating coupon');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon code "${code}"?`)) return;
    try {
      const res = await adminApi.deleteCoupon(id);
      if (res.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
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
            <Tag className="w-7 h-7 text-emerald-400" />
            <span>Discount Coupons & Promo Codes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create percentage or flat discounts, cart minimums, and usage quotas ({coupons.length} coupons)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon Code</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No promotional coupons created</h3>
          <p className="text-xs text-slate-400 mt-1">Click "New Coupon Code" to launch a campaign discount.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-emerald-400 tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                    {c.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <p className="text-base font-bold text-white">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                  </p>
                  {c.minOrderAmount ? (
                    <p className="text-slate-400">Min Cart Value: ₹{c.minOrderAmount}</p>
                  ) : null}
                  {c.maxDiscountAmount ? (
                    <p className="text-slate-400">Max Discount: ₹{c.maxDiscountAmount}</p>
                  ) : null}
                  <p className="text-slate-400">Times Used: {c.timesUsed || 0} times</p>
                  {c.expiryDate && (
                    <p className="text-[11px] text-amber-400 font-mono">
                      Expires: {new Date(c.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c._id, c.code)}
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
          <div className="bg-[#1C2541] border border-[#3A506B] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon Code'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER20"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-emerald-400 font-mono font-bold text-sm uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
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
                  <span>Active & Redeemable at Checkout</span>
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
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
