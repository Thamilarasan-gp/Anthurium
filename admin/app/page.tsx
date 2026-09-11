'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();
  const { adminUser, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (adminUser) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [adminUser, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-slate-300">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
      <p className="text-sm font-medium">Navigating to Admin Portal...</p>
    </div>
  );
}
