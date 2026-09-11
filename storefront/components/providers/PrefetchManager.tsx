'use client';

import { useEffect } from 'react';
import { prefetchCommonData } from '../../lib/api';

export const PrefetchManager: React.FC = () => {
  useEffect(() => {
    prefetchCommonData();
  }, []);

  return null;
};
