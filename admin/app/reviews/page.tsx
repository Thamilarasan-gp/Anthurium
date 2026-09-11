'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Review } from '@shared/types';
import { Star, CheckCircle, XCircle, Trash2, Search, Loader2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getReviews();
      if (res.success && res.reviews) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await adminApi.updateReviewStatus(id, newStatus);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error updating review status');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await adminApi.updateReviewStatus(id, undefined as any, !currentFeatured);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, featured: !currentFeatured } : r))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error updating review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer review permanently?')) return;
    try {
      const res = await adminApi.deleteReview(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Star className="w-7 h-7 text-emerald-400" />
            <span>Customer Testimonials & Reviews</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Moderate ratings, approve customer feedback, and feature reviews on product pages ({reviews.length} reviews)
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-[#334155]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name or review keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 px-3.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <Star className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No reviews found</h3>
          <p className="text-xs text-slate-400 mt-1">Customer reviews will appear here as they are submitted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-600 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-400 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <h4 className="font-semibold text-white text-sm">{r.title || 'Product Feedback'}</h4>
                    <p className="text-xs text-slate-400">By {r.customerName}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      r.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : r.status === 'rejected'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  "{r.comment}"
                </p>

                {r.product && typeof r.product === 'object' && (
                  <p className="text-[11px] text-slate-400 mt-2 font-mono truncate">
                    Product: {(r.product as any).title}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => handleToggleFeatured(r._id, !!r.featured)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                    r.featured
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.featured ? '★ Featured on Home' : '☆ Mark Featured'}
                </button>

                <div className="flex items-center space-x-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'approved')}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                      title="Approve Review"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'rejected')}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                      title="Reject Review"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
