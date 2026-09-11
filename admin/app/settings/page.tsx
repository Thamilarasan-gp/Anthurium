'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../lib/adminApi';
import { WebsiteSettings } from '@shared/types';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import {
  Settings,
  Store,
  Phone,
  MessageCircle,
  MapPin,
  Share2,
  Truck,
  CheckCircle,
  Loader2,
  Save
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await adminApi.getSettings();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const res = await adminApi.updateSettings(settings);
      if (res.success) {
        setSuccessMsg('Store settings updated successfully across storefront and backend.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(res.message || 'Failed to update settings');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
        <p className="text-sm">Loading Store Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Settings className="w-7 h-7 text-emerald-400" />
            <span>Store Configuration & Brand Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic client branding, WhatsApp commerce, logistics fees & social contact info
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Brand Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Brand / Boutique Name</label>
              <input
                type="text"
                value={settings.brandName || ''}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                placeholder="ANTHURIUM"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="FASHION BLOOMS HERE"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={settings.announcementBarText || ''}
              onChange={(e) => setSettings({ ...settings, announcementBarText: e.target.value })}
              placeholder="COMPLIMENTARY SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹2,999"
              className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs sm:text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-700/60 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-200">
                Company Profile Picture / Boutique Logo
              </label>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Recommended: <strong>500 × 500 px (1:1 Square)</strong>
              </span>
            </div>

            <ImageUploadInput
              value={settings.logoUrl || ''}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              placeholder="Paste image URL or upload profile image file to Cloudinary..."
              description="Optimal dimension: 500 × 500 px (1:1 square ratio, minimum 200 × 200 px). Transparent PNG or high-res JPG/WEBP recommended. Rendered inside the circular gold emblem in the navigation header on desktop and mobile."
            />
          </div>
        </div>

        {/* WhatsApp & Contact */}
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Commerce & Customer Care</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="919876543210"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="care@anthurium.in"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Boutique Physical Address</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                value={settings.address?.street || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    address: { ...(settings.address as any), street: e.target.value }
                  })
                }
                placeholder="No. 42, Designer Avenue, Indiranagar"
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">City, State & Pincode</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={settings.address?.city || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...(settings.address as any), city: e.target.value }
                    })
                  }
                  placeholder="Bengaluru"
                  className="px-2.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                />
                <input
                  type="text"
                  value={settings.address?.state || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...(settings.address as any), state: e.target.value }
                    })
                  }
                  placeholder="Karnataka"
                  className="px-2.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs"
                />
                <input
                  type="text"
                  value={settings.address?.pincode || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...(settings.address as any), pincode: e.target.value }
                    })
                  }
                  placeholder="560038"
                  className="px-2.5 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Rules */}
        <div className="bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-[#334155] space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Shipping & Checkout Policy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold || 2999}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shippingFee || 150}
                onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Cash on Delivery (COD) Fee (₹)</label>
              <input
                type="number"
                value={settings.codFee || 99}
                onChange={(e) => setSettings({ ...settings, codFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
