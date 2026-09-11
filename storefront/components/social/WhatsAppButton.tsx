'use client';

import React from 'react';
import Image from 'next/image';
import whatsappIcon from '@/lib/imgs/WhatsApp_icon.png';
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
      className="fixed bottom-6 right-6 z-40 transition-transform duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center filter drop-shadow-2xl"
      aria-label="Chat on WhatsApp"
      title="Chat with Anthurium Boutique"
    >
      <Image
        src={whatsappIcon}
        alt="Chat on WhatsApp"
        width={58}
        height={58}
        className="w-14 h-14 object-contain"
        priority
      />
    </a>
  );
};
