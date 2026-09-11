'use client';

import React from 'react';
import { Truck, ShieldCheck, Clock } from 'lucide-react';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function ShippingPage() {
  const { config } = useStoreConfig();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">EXPRESS DELIVERY</span>
        <h1 className="font-editorial text-4xl font-bold text-botanical">Shipping & Delivery</h1>
        <p className="text-xs text-gray-500">Fast, secure pan-India shipping directly from our Coimbatore boutique.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rose-100/60 shadow-soft space-y-6 text-xs text-charcoal/80 leading-relaxed font-light">
        <h3 className="font-editorial text-xl font-bold text-botanical">Delivery Policies</h3>
        <p>• <strong>Free Shipping:</strong> Free express shipping across India on orders above {config.currency.symbol}{config.freeShippingThreshold}.</p>
        <p>• <strong>Standard Shipping Fee:</strong> {config.currency.symbol}{config.shippingFee} flat fee for orders under {config.currency.symbol}{config.freeShippingThreshold}.</p>
        <p>• <strong>Processing Time:</strong> Orders are dispatched within 24-48 hours from our Coimbatore atelier.</p>
        <p>• <strong>Delivery Timeframe:</strong> Metro cities: 2-4 business days. Other regions: 4-7 business days.</p>
        <p>• <strong>Cash on Delivery (COD):</strong> Available across 18,000+ pincodes with a nominal COD fee of {config.currency.symbol}{config.codFee}.</p>
      </div>
    </div>
  );
}
