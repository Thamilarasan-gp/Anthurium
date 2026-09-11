'use client';

import React from 'react';
import { Menu, LogOut, ShieldCheck, Bell } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { adminUser, logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1E293B]">
      <div className="flex items-center space-x-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
            Verified Admin Portal
          </span>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            admin.anthurium.in
          </span>
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center space-x-4">
        {/* User Info & Logout */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-200">{adminUser?.name || 'Administrator'}</span>
            <span className="text-[10px] text-slate-400">{adminUser?.email || 'admin@anthurium.com'}</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-semibold text-xs shadow-sm">
            {(adminUser?.name?.[0] || 'A').toUpperCase()}
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
