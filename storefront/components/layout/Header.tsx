'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, LogOut, Shield, Package, MapPin } from 'lucide-react';
import { useStoreConfig } from '../providers/StoreConfigContext';
import { useCart } from '../providers/CartContext';
import { useWishlist } from '../providers/WishlistContext';
import { useAuth } from '../providers/AuthContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useStoreConfig();
  const { cartCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();

  const handlePrefetch = useCallback((href: string) => {
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      router.prefetch(href);
    }
  }, [router]);

  const isHome = pathname === '/';
  const hasAnnouncement = Boolean(config.announcementBarText);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOccasionOpen, setIsOccasionOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const occasionRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (occasionRef.current && !occasionRef.current.contains(event.target as Node)) {
        setIsOccasionOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'New In', href: '/collections/new-arrivals' },
    { name: 'Sarees', href: '/sarees' },
    { name: 'Kurtis', href: '/kurtis' },
    { name: 'Dresses', href: '/dresses' },
    { name: 'Sets', href: '/sets' },
  ];

  const occasionItems = [
    { name: 'Festive Edit', href: '/collections/festive' },
    { name: 'Wedding Stories', href: '/collections/wedding' },
    { name: 'Everyday Grace', href: '/collections/everyday' },
    { name: 'Occasion Wear', href: '/collections/occasion' },
  ];

  const trailingLinks = [
    { name: 'Accessories', href: '/accessories' },
    { name: 'Stories', href: '/stories' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${config.brandName}, I would like to enquire about your boutique collection.`
  )}`;

  return (
    <>
      {/* Floating Capsule Header Container */}
      <header
        className={`z-40 w-full px-2 sm:px-4 lg:px-8 max-w-[1360px] mx-auto transition-all duration-300 ${isHome
            ? isScrolled
              ? 'fixed top-2 sm:top-3 left-0 right-0'
              : hasAnnouncement
                ? 'absolute top-[44px] sm:top-[48px] left-0 right-0'
                : 'absolute top-2 sm:top-3 left-0 right-0'
            : 'sticky top-2 sm:top-3'
          }`}
      >
        <div
          className="w-full h-[58px] sm:h-[64px] rounded-full px-3.5 sm:px-6 flex items-center justify-between shadow-[0_4px_25px_rgba(46,64,54,0.08)] border border-white/80 transition-all duration-300"
          style={{
            background:
              'linear-gradient(90deg, rgba(214, 236, 214, 0.94) 0%, rgba(250, 247, 240, 0.98) 32%, rgba(250, 247, 240, 0.98) 68%, rgba(222, 237, 226, 0.94) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Left: Gold Circular Emblem & Brand Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#24362C] hover:text-[#0B4A2B] transition"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              prefetch={true}
              onPointerEnter={() => handlePrefetch('/')}
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              {/* Circular Gold Emblem */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#FAF3DE] to-[#F1E4B9] border border-[#D8BE76] shadow-[0_2px_8px_rgba(216,190,118,0.25)] flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt={config.brandName || 'Logo'}
                    className="w-full h-full object-cover rounded-full p-0.5"
                  />
                ) : (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-6 h-6 sm:w-7 sm:h-7 text-[#B8923A]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <circle cx="50" cy="50" r="45" strokeDasharray="3 2" strokeWidth="1.2" opacity="0.6" />
                    <circle cx="50" cy="50" r="40" strokeWidth="1" />
                    <path
                      d="M50 22 C46 36, 46 44, 50 64 C54 44, 54 36, 50 22 Z"
                      fill="currentColor"
                      fillOpacity="0.25"
                    />
                    <path d="M50 22 C40 34, 30 46, 33 60 C38 54, 45 52, 50 64" strokeWidth="1.8" />
                    <path d="M50 22 C60 34, 70 46, 67 60 C62 54, 55 52, 50 64" strokeWidth="1.8" />
                    <path d="M33 60 C23 48, 17 55, 25 70 C34 70, 42 64, 50 64" strokeWidth="1.8" />
                    <path d="M67 60 C77 48, 83 55, 75 70 C66 70, 58 64, 50 64" strokeWidth="1.8" />
                    <path
                      d="M25 70 C35 79, 65 79, 75 70 C68 76, 32 76, 25 70 Z"
                      fill="currentColor"
                      fillOpacity="0.3"
                    />
                    <circle cx="50" cy="50" r="3.5" fill="currentColor" />
                  </svg>
                )}
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col items-start leading-none">
                <span className="font-serif text-[21px] sm:text-[24px] font-medium tracking-[-0.01em] text-[#1C2C22] group-hover:text-[#0B4A2B] transition-colors">
                  {config.brandName || 'ANTHURIUM'}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-sans font-medium uppercase tracking-[0.28em] text-[#42594C] mt-0.5">
                  THE BOUTIQUE
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onPointerEnter={() => handlePrefetch(link.href)}
                  className={`text-[13.5px] font-medium tracking-normal transition-colors py-1 ${isActive ? 'text-[#0B4A2B] font-semibold' : 'text-[#2D3E35] hover:text-[#0B4A2B]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Occasion Dropdown */}
            <div className="relative" ref={occasionRef}>
              <button
                onClick={() => setIsOccasionOpen(!isOccasionOpen)}
                onMouseEnter={() => {
                  setIsOccasionOpen(true);
                  occasionItems.forEach((item) => handlePrefetch(item.href));
                }}
                className={`text-[13.5px] font-medium tracking-normal flex items-center space-x-1 py-1 transition-colors ${pathname.startsWith('/collections')
                  ? 'text-[#0B4A2B] font-semibold'
                  : 'text-[#2D3E35] hover:text-[#0B4A2B]'
                  }`}
              >
                <span>Occasion</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#2D3E35] transition-transform duration-200 ${isOccasionOpen ? 'rotate-180 text-[#0B4A2B]' : ''
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOccasionOpen && (
                <div
                  onMouseLeave={() => setIsOccasionOpen(false)}
                  className="absolute top-full left-0 mt-2 w-48 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-gray-200 p-2 space-y-1 animate-fade-in z-50"
                  style={{
                    backgroundColor: '#FFFFFF',
                    background: '#FFFFFF',
                    opacity: 1,
                  }}
                >
                  {occasionItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      onPointerEnter={() => handlePrefetch(item.href)}
                      onClick={() => setIsOccasionOpen(false)}
                      className="block px-3.5 py-2 text-xs font-medium text-[#2D3E35] hover:text-[#0B4A2B] hover:bg-emerald-50/70 rounded-xl transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Trailing Links */}
            {trailingLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onPointerEnter={() => handlePrefetch(link.href)}
                  className={`text-[13.5px] font-medium tracking-normal transition-colors py-1 ${isActive ? 'text-[#0B4A2B] font-semibold' : 'text-[#2D3E35] hover:text-[#0B4A2B]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions & WhatsApp Us Button */}
          <div className="flex items-center space-x-2 sm:space-x-3.5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 sm:p-2 text-[#24362C] hover:text-black rounded-full hover:bg-white hover:shadow-xs transition relative"
              title="Search styles"
              aria-label="Search"
            >
              <Search className="w-[19px] h-[19px] stroke-[1.8]" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              prefetch={true}
              onPointerEnter={() => handlePrefetch('/wishlist')}
              className="p-1.5 sm:p-2 text-[#24362C] hover:text-rose-600 rounded-full hover:bg-white hover:shadow-xs transition relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-[19px] h-[19px] stroke-[1.8]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#EE5D70] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon with Coral Badge */}
            <button
              onClick={openCart}
              className="p-1.5 sm:p-2 text-[#24362C] hover:text-black rounded-full hover:bg-white hover:shadow-xs transition relative"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 bg-[#EE5D70] text-white text-[9px] sm:text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {cartCount}
              </span>
            </button>

            {/* User / Account Button & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => handlePrefetch('/account')}
                  className="flex items-center space-x-1.5 p-1 sm:p-1.5 text-[#24362C] hover:text-[#0B4A2B] rounded-full hover:bg-white hover:shadow-xs transition"
                  title={user.name}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-white text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-300 shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  prefetch={true}
                  onPointerEnter={() => handlePrefetch('/login')}
                  className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-[#24362C] hover:text-[#0B4A2B] rounded-full hover:bg-white hover:shadow-xs transition"
                  title="Sign In / Register"
                >
                  <User className="w-[19px] h-[19px] stroke-[1.8]" />
                  <span className="hidden xl:inline text-xs font-medium">Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-gray-200 p-2 space-y-1 animate-fade-in z-50"
                  style={{
                    backgroundColor: '#FFFFFF',
                    background: '#FFFFFF',
                    opacity: 1,
                  }}
                >
                  <div className="px-3 py-2 border-b border-gray-200/80 mb-1">
                    <p className="text-xs font-bold text-[#1C2C22] truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                        Boutique Admin
                      </span>
                    )}
                  </div>

                  <Link
                    href="/account"
                    prefetch={true}
                    onPointerEnter={() => handlePrefetch('/account')}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#2D3E35] hover:text-[#0B4A2B] hover:bg-[#FAF7F2] rounded-xl transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    href="/account"
                    prefetch={true}
                    onPointerEnter={() => handlePrefetch('/account')}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#2D3E35] hover:text-[#0B4A2B] hover:bg-[#FAF7F2] rounded-xl transition"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>My Orders</span>
                  </Link>

                  {isAdmin && (
                    <a
                      href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/70 rounded-xl transition"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin CMS Panel</span>
                    </a>
                  )}

                  <div className="border-t border-gray-200/80 my-1 pt-1">
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Expandable Floating Search Bar */}
        {isSearchOpen && (
          <div className="mt-2 max-w-2xl mx-auto bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-3 shadow-xl border border-white/80 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Sarees, Kurtis, Organza, Silk, Chanderi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-emerald-200/60 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4A2B]"
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="submit"
                className="bg-[#0B4A2B] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#07361E] transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="relative bg-[#FAF7F2] w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div>
              <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#FFFDF7] to-[#F1E4B9] border border-[#D8BE76] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {config.logoUrl ? (
                      <img
                        src={config.logoUrl}
                        alt={config.brandName || 'Logo'}
                        className="w-full h-full object-cover rounded-full p-0.5"
                      />
                    ) : (
                      <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#B8923A]" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="50" cy="50" r="40" strokeWidth="1" />
                        <circle cx="50" cy="50" r="3.5" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C2C22]">{config.brandName || 'ANTHURIUM'}</h3>
                    <p className="text-[8px] uppercase tracking-widest text-[#42594C]">THE BOUTIQUE</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-charcoal hover:text-rose-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Categories & Edits</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    onTouchStart={() => handlePrefetch(link.href)}
                    onMouseEnter={() => handlePrefetch(link.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-charcoal hover:text-[#0B4A2B] transition py-1 border-b border-gray-100"
                  >
                    {link.name}
                  </Link>
                ))}

                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold pt-2">Occasion</p>
                {occasionItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    onTouchStart={() => handlePrefetch(item.href)}
                    onMouseEnter={() => handlePrefetch(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-charcoal hover:text-[#0B4A2B] transition py-1 border-b border-gray-100 pl-2"
                  >
                    {item.name}
                  </Link>
                ))}

                {trailingLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={true}
                    onTouchStart={() => handlePrefetch(link.href)}
                    onMouseEnter={() => handlePrefetch(link.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-charcoal hover:text-[#0B4A2B] transition py-1 border-b border-gray-100"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-rose-100/60 pt-5 space-y-3">
              {user ? (
                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-[#1C2C22]">{user.name}</p>
                      <p className="text-[10px] text-gray-500">{user.email}</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2 bg-white rounded-xl border border-gray-200 text-[#1E261F] font-medium"
                    >
                      My Account
                    </Link>
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center py-2 bg-[#0B4A2B] rounded-xl text-white font-medium"
                      >
                        Admin CMS
                      </Link>
                    ) : (
                      <button
                        onClick={async () => {
                          await logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-center py-2 bg-rose-50 text-rose-700 rounded-xl font-medium border border-rose-200"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-full bg-[#0B4A2B] text-white text-xs font-medium shadow-sm hover:bg-[#07361E] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-full bg-white border border-gray-300 text-[#1E261F] text-xs font-medium hover:bg-gray-50 transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-[#0B4A2B] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md"
              >
                <span>WhatsApp Us</span>
              </a>

              <div className="flex justify-around text-xs text-gray-500 pt-2">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link href="/craft" onClick={() => setIsMobileMenuOpen(false)}>Our Craft</Link>
                <Link href="/store" onClick={() => setIsMobileMenuOpen(false)}>Store Locator</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

