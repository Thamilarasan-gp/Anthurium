'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../lib/adminApi';
import { Order, OrderStatus } from '@shared/types';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Package,
  Loader2,
  Filter
} from 'lucide-react';

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  refunded: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as OrderStatus } : o))
        );
      } else {
        alert(res.message || 'Status update failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (o.user as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <ShoppingCart className="w-7 h-7 text-emerald-400" />
            <span>Orders Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track fulfillment, update logistics status & inspect customer deliveries ({orders.length} total orders)
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-[#334155]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search order #, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Order Records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <ShoppingCart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No matching orders found</h3>
          <p className="text-xs text-slate-400 mt-1">Check your search query or status filter.</p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider border-b border-[#334155]">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <Link href={`/orders/${o._id}`} className="font-mono font-bold text-white hover:text-emerald-400">
                        {o.orderNumber}
                      </Link>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">
                        {o.shippingAddress?.name || (o.user as any)?.name || 'Guest Shopper'}
                      </p>
                      <p className="text-[11px] text-slate-400">{o.shippingAddress?.phone || 'N/A'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {o.items?.length || 0} style(s)
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-200 uppercase">{o.paymentMethod}</span>
                        <span
                          className={`text-[10px] font-medium uppercase ${
                            o.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleQuickStatusChange(o._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-900 cursor-pointer focus:ring-1 focus:ring-emerald-500 ${
                          ORDER_STATUS_COLORS[o.orderStatus] || 'text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{o.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/orders/${o._id}`}
                        className="inline-flex items-center space-x-1 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-400 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
