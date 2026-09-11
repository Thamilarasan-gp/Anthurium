'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@shared/types';
import { api } from '../../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>;
  register: (payload: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('anthurium_token');
        if (token) {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (res.success && res.token && res.user) {
      localStorage.setItem('anthurium_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.success && res.token && res.user) {
      localStorage.setItem('anthurium_token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('anthurium_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
