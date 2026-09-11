'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, Loader2 } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const res = await adminApi.getCustomers();
        if (res.success && res.customers) {
          setCustomers(res.customers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>Customer Profiles</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registered patrons, shopping frequency, lifetime value & contact history ({customers.length} customers)
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, email or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Customer Directory...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="py-16 text-center bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No customers found</h3>
          <p className="text-xs text-slate-400 mt-1">Customer profiles will appear here as orders and registrations occur.</p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider border-b border-[#334155]">
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                  <th className="py-3.5 px-4 font-semibold">Lifetime Spend</th>
                  <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
                          {c.name ? c.name[0].toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <span className="text-[10px] font-mono text-emerald-400">ID: {c._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && c.phone !== 'N/A' && (
                        <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                          <Phone className="w-3 h-3" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                        <ShoppingBag className="w-3 h-3 text-emerald-400 mr-1" />
                        {c.totalOrders} order(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{c.totalSpent?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                      {c.lastOrder
                        ? new Date(c.lastOrder).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'No orders yet'}
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
