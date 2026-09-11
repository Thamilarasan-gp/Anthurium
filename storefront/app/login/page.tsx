'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../components/providers/AuthContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { config } = useStoreConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;

    const res = await login({ email: loginEmail, password: loginPass });
    if (res.success) {
      setSuccessMsg(`Welcome back, ${res.user?.name}!`);
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      }, 500);
    } else {
      setError(res.message || 'Invalid email or password. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@anthurium.com');
      setPassword('adminpassword123');
      handleSubmit(undefined, 'admin@anthurium.com', 'adminpassword123');
    } else {
      setEmail('priya.test@gmail.com');
      setPassword('password123');
      handleSubmit(undefined, 'priya.test@gmail.com', 'password123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#0B4A2B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B4A2B]">
              WELCOME BACK
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E261F]">
            Sign In to {config.brandName || 'Varnika'}
          </h1>
          <p className="text-xs text-gray-500 font-sans">
            Access your wishlist, active boutique orders, and saved addresses.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-white/80 to-rose-50/70 p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] text-center">
            ⚡ Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#0B4A2B] hover:bg-[#07361E] text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Login as Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              disabled={loading}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-white hover:bg-gray-50 text-[#1E261F] rounded-xl text-xs font-semibold border border-gray-300 shadow-xs transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Login as Customer</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold text-center border border-rose-200 animate-fade-in">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold text-center border border-emerald-200 animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="bg-white p-7 sm:p-8 rounded-3xl border border-gray-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-4"
        >
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                placeholder="customer@anthurium.com"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B4A2B] hover:bg-[#07361E] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition mt-2 disabled:opacity-60"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>New to the boutique?</span>
            <Link href="/register" className="text-[#0B4A2B] hover:underline font-bold">
              Create an Account →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

