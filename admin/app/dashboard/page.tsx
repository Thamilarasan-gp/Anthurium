'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../lib/adminApi';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm">Loading Store Metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingReviews: 0,
    lowStockCount: 0
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${(metrics.totalRevenue || 0).toLocaleString('en-IN')}`,
      change: '+18.2% from last month',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders || 0,
      change: 'Active Boutique Orders',
      icon: ShoppingCart,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Customer Accounts',
      value: metrics.totalCustomers || 0,
      change: 'Registered Shoppers',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Products in Catalog',
      value: metrics.totalProducts || 0,
      change: 'Active & Draft Styles',
      icon: Package,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time performance, order activity, and catalog analytics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-5 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.title}</span>
                <div className={`p-2.5 rounded-xl border ${c.bg} ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{c.value}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mr-1 inline" />
                  {c.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white text-base">Recent Orders</h3>
              </div>
              <Link href="/orders" className="text-xs font-medium text-emerald-400 hover:underline flex items-center">
                <span>View all orders</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.recentOrders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 font-mono font-medium text-slate-200">
                          <Link href={`/orders/${order._id}`} className="hover:text-emerald-400">
                            {order.orderNumber || order._id.slice(-6)}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-300">
                          {order.user?.name || order.shippingAddress?.name || 'Customer'}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${order.orderStatus === 'delivered'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : order.orderStatus === 'cancelled'
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-white">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-8 text-center">No orders recorded yet.</p>
            )}
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1E293B] border border-[#334155] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-white text-base">Low Stock Alert</h3>
              </div>
              <Link href="/inventory" className="text-xs font-medium text-amber-400 hover:underline">
                Manage
              </Link>
            </div>

            {data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
              <div className="space-y-3 mt-4">
                {data.lowStockProducts.slice(0, 5).map((p: any) => (
                  <div key={p._id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                ✅ All products have healthy stock levels.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <Link
              href="/inventory"
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <span>View Full Stock Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
