'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderKanban,
  ShoppingCart,
  Users,
  Warehouse,
  Sparkles,
  Video,
  BookOpen,
  Image as ImageIcon,
  Star,
  Tag,
  Settings,
  X,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Layers },
  { name: 'Collections', href: '/collections', icon: FolderKanban },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Warehouse },
];

const websiteNavItems: NavItem[] = [
  { name: 'Hero Slides', href: '/website/hero', icon: Sparkles },
  { name: 'Stories / Reels', href: '/website/stories', icon: Video },
  { name: 'Lookbook', href: '/website/lookbook', icon: BookOpen },
  { name: 'Banners', href: '/website/banners', icon: ImageIcon },
];

const secondaryNavItems: NavItem[] = [
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Coupons', href: '/coupons', icon: Tag },
  { name: 'Store Settings', href: '/settings', icon: Settings },
];

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderNavLinks = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = isLinkActive(item.href);
        const Icon = item.icon;
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B132B] border-r border-[#1E293B] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#1E293B] flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-inner">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white tracking-wide text-sm">ANTHURIUM</span>
                <span className="text-[10px] tracking-wider text-emerald-400 font-mono uppercase">Control Center</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Scrollable Area */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Core Commerce
              </p>
              {renderNavLinks(mainNavItems)}
            </div>

            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Storefront CMS
              </p>
              {renderNavLinks(websiteNavItems)}
            </div>

            <div>
              <p className="px-3.5 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Marketing & System
              </p>
              {renderNavLinks(secondaryNavItems)}
            </div>
          </nav>

          {/* Footer / Storefront Link */}
          <div className="p-3.5 border-t border-[#1E293B] bg-slate-900/40">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>View Live Storefront</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
