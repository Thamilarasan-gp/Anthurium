'use client';

import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">HASSLE-FREE ASSISTANCE</span>
        <h1 className="font-editorial text-4xl font-bold text-botanical">Returns & Exchange Policy</h1>
        <p className="text-xs text-gray-500">We want you to fall completely in love with your Anthurium outfit.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rose-100/60 shadow-soft space-y-6 text-xs text-charcoal/80 leading-relaxed font-light">
        <h3 className="font-editorial text-xl font-bold text-botanical">7-Day Doorstep Exchange</h3>
        <p>• <strong>Eligibility:</strong> Items must be unworn, unwashed, with original boutique tags intact.</p>
        <p>• <strong>Size Exchange:</strong> Free doorstep reverse pickup and exchange for size adjustments.</p>
        <p>• <strong>Custom Tailored Orders:</strong> Made-to-measure bridal or customized saree blouses are non-returnable.</p>
      </div>
    </div>
  );
}
