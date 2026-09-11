'use client';

import React from 'react';
import { useStoreConfig } from '../providers/StoreConfigContext';

export const AnnouncementBar: React.FC = () => {
  const { config } = useStoreConfig();

  if (!config.announcementBarText) return null;

  return (
    <div
      id="announcement-bar"
      className="relative z-50 bg-botanical text-ivory text-xs h-9 px-4 flex items-center justify-center text-center tracking-widest uppercase font-medium overflow-hidden"
    >
      <div className="animate-pulse truncate max-w-full">
        {config.announcementBarText}
      </div>
    </div>
  );
};
