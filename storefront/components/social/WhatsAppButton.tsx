'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreConfig } from '../providers/StoreConfigContext';

export const WhatsAppButton: React.FC = () => {
  const { config } = useStoreConfig();

  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${config.brandName}, I would like to enquire about your boutique collection.`
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center space-x-2 group border border-emerald-400/30"
      aria-label="Chat on WhatsApp"
      title="Chat with Anthurium Boutique"
    >
      <MessageCircle className="w-6 h-6 fill-white/20" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-bold uppercase tracking-wider whitespace-nowrap pr-0">
        Chat on WhatsApp
      </span>
    </a>
  );
};
