'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { Warehouse, Search, AlertTriangle, CheckCircle, Save, Loader2, ArrowUpDown } from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<{ [id: string]: number }>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getInventory();
      if (res.success && res.inventory) {
        setInventory(res.inventory);
        const initialMap: Record<string, number> = {};
        res.inventory.forEach((p: any) => {
          initialMap[p._id] = p.stock;
        });
        setEditingStock(initialMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId: string, val: number) => {
    setEditingStock((prev) => ({ ...prev, [productId]: val }));
  };

  const saveQuickStock = async (productId: string) => {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;

    setSavingId(productId);
    try {
      const res = await adminApi.updateStock(productId, newStock);
      if (res.success) {
        setSavedSuccessId(productId);
        setTimeout(() => setSavedSuccessId(null), 3000);
        setInventory((prev) =>
          prev.map((item) => (item._id === productId ? { ...item, stock: newStock } : item))
        );
      } else {
        alert(res.message || 'Failed to update stock');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating stock');
    } finally {
      setSavingId(null);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStock === 'out') return item.stock === 0;
    if (filterStock === 'low') return item.stock > 0 && item.stock <= 5;
    if (filterStock === 'healthy') return item.stock > 5;
    return true;
  });

  const outOfStockCount = inventory.filter((i) => i.stock === 0).length;
  const lowStockCount = inventory.filter((i) => i.stock > 0 && i.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Warehouse className="w-7 h-7 text-emerald-400" />
            <span>Inventory & Stock Sheet</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time SKU quantities, inline inventory replenishments, and low-stock alerts
          </p>
        </div>
      </div>

      {/* Stock Health Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Styles</p>
            <p className="text-2xl font-bold text-white mt-1">{inventory.length}</p>
          </div>
          <span className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
            <Warehouse className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400 uppercase font-semibold">Low Stock Warnings (≤ 5)</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{lowStockCount}</p>
          </div>
          <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-400 uppercase font-semibold">Out of Stock (0)</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{outOfStockCount}</p>
          </div>
          <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#1E293B] p-3 rounded-2xl border border-[#334155]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="w-full sm:w-44 px-3.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">All Stock Statuses</option>
          <option value="healthy">Healthy (&gt; 5)</option>
          <option value="low">Low Stock (1-5)</option>
          <option value="out">Out of Stock (0)</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm">Loading Stock Sheet...</p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 text-[11px] uppercase tracking-wider border-b border-[#334155]">
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">SKU</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Quick Update Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {filteredItems.map((item) => {
                  const currentVal = editingStock[item._id] ?? item.stock;
                  const hasChanged = currentVal !== item.stock;

                  return (
                    <tr key={item._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {item.images?.[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-white truncate max-w-xs">{item.title}</p>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Sizes: {item.sizes?.join(', ') || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300">{item.sku || '—'}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {typeof item.category === 'object' && item.category ? (item.category as any).name : '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        ₹{(item.salePrice || item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.stock === 0
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : item.stock <= 5
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={currentVal}
                            onChange={(e) => handleStockChange(item._id, Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-[#0F172A] border border-[#334155] rounded-lg text-white text-center text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            onClick={() => saveQuickStock(item._id)}
                            disabled={!hasChanged || savingId === item._id}
                            className={`p-1.5 rounded-lg text-xs font-medium transition ${
                              hasChanged
                                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                            title="Save new stock quantity"
                          >
                            {savingId === item._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : savedSuccessId === item._id ? (
                              <CheckCircle className="w-4 h-4 text-emerald-300" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
