'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '@shared/types';
import { defaultStoreConfig } from '../../lib/storeConfig';
import { api } from '../../lib/api';

interface StoreConfigContextType {
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => Promise<void>;
  loading: boolean;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export const StoreConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultStoreConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings) {
          setConfig((prev) => ({ ...prev, ...res.settings }));
        }
      } catch (err) {
        console.error('Error loading store settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    try {
      await api.updateSettings(newConfig);
    } catch (err) {
      console.error('Error saving store config:', err);
    }
  };

  return (
    <StoreConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => {
  const context = useContext(StoreConfigContext);
  if (!context) throw new Error('useStoreConfig must be used within StoreConfigProvider');
  return context;
};
