'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function FAQPage() {
  const { config } = useStoreConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'You can browse our online catalogue, select your size, and add pieces to your bag. You can also order directly via WhatsApp or visit our Coimbatore boutique.'
    },
    {
      q: 'Do you ship across India?',
      a: `Yes! We offer express courier shipping to over 18,000+ pincodes across India. Free shipping applies on orders over ${config.currency.symbol}${config.freeShippingThreshold}.`
    },
    {
      q: 'How long does delivery take?',
      a: 'Metro cities typically receive orders within 2-4 business days. Regional and tier-2/3 cities take 4-7 business days.'
    },
    {
      q: 'Can I exchange my outfit if it does not fit?',
      a: 'Yes, we offer a hassle-free 7-day doorstep size exchange. Simply contact our support team or WhatsApp us.'
    },
    {
      q: 'How do I choose my correct size?',
      a: 'Please refer to our detailed Size Guide. All measurements are provided in inches. If you fall between sizes, we recommend sizing up.'
    },
    {
      q: 'Can I order directly through WhatsApp?',
      a: `Absolutely! Click the "Enquire on WhatsApp" button on any product page or text us at +${config.whatsappNumber}.`
    },
    {
      q: 'Where is your boutique store located?',
      a: `Our flagship boutique atelier is located at ${config.address.street}, ${config.address.city}, Tamil Nadu.`
    },
    {
      q: 'How do I track my order status?',
      a: 'You can enter your order number on our Track Order page to view live courier status updates.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">HELP CENTER</span>
        <h1 className="font-editorial text-4xl font-bold text-botanical">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">Got questions about ordering, sizing, or boutique visits? Find answers below.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-rose-100/60 overflow-hidden shadow-card">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center space-x-4 font-editorial font-bold text-base text-botanical hover:text-rose-700 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-rose-600 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-charcoal/80 font-light leading-relaxed border-t border-gray-50 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
