'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../components/providers/AuthContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { config } = useStoreConfig();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const res = await register({ name, email, password, phone });
    if (res.success) {
      setSuccessMsg(`Account created! Welcome to ${config.brandName || 'Varnika'}.`);
      setTimeout(() => {
        router.push('/account');
      }, 500);
    } else {
      setError(res.message || 'Registration failed. Please check the details entered.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#0B4A2B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0B4A2B]">
              JOIN THE STYLE CIRCLE
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E261F]">
            Create Account
          </h1>
          <p className="text-xs text-gray-500 font-sans">
            Join our boutique family to save wishlists and enjoy express shipping.
          </p>
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
          onSubmit={handleSubmit}
          className="bg-white p-7 sm:p-8 rounded-3xl border border-gray-200/70 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-4"
        >
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] block mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                placeholder="Priya Sharma"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
                placeholder="priya@example.com"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                placeholder="+91 98765 43210"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E261F] block mb-1">
              Create Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                placeholder="Minimum 6 characters"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B4A2B] hover:bg-[#07361E] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition mt-2 disabled:opacity-60"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>Already have an account?</span>
            <Link href="/login" className="text-[#0B4A2B] hover:underline font-bold">
              Sign In Instead →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

