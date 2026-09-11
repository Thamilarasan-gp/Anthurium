'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminApi } from '../lib/adminApi';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getMe();
      if (res.success && res.user && res.user.role === 'admin') {
        setAdminUser(res.user);
      } else {
        setAdminUser(null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_token');
          localStorage.removeItem('admin_token');
        }
      }
    } catch {
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!adminUser && pathname !== '/login') {
        router.replace('/login');
      } else if (adminUser && pathname === '/login') {
        router.replace('/dashboard');
      }
    }
  }, [adminUser, isLoading, pathname, router]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await adminApi.login(credentials);
      if (res.success && res.user && res.user.role === 'admin') {
        if (res.token && typeof window !== 'undefined') {
          sessionStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_token', res.token);
        }
        setAdminUser(res.user);
        setIsLoading(false);
        router.replace('/dashboard');
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          message: res.message || 'Access denied: Valid administrator role required.'
        };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token');
      }
      setAdminUser(null);
      router.replace('/login');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, isLoading, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
