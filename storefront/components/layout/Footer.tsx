'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import img1 from '@/lib/imgs/cat1.png';
import img2 from '@/lib/imgs/cat2.png';
import img3 from '@/lib/imgs/cat3.png';
import {
  Truck,
  Package,
  ShieldCheck,
  Gift,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Heart,
  Instagram,
  Facebook,
  Youtube,
  Check
} from 'lucide-react';
import { useStoreConfig } from '../providers/StoreConfigContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { config } = useStoreConfig();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Do not render consumer footer in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#FAF7F2] text-[#23211E] overflow-hidden pt-12">
      {/* ========================================================================= */}
      {/* SECTION 1: THREE CURATED COLLECTION BANNERS                                */}
      {/* ========================================================================= */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Festive In You */}
          <div
            className="rounded-3xl overflow-hidden relative flex items-center justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-300 hover:shadow-lg group"
            style={{
              background: 'linear-gradient(135deg, #FDE3A7 0%, #F8D18C 50%, #F3C475 100%)',
            }}
          >
            <div className="p-6 sm:p-7 z-10 max-w-[58%]">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1E261F] font-normal leading-[1.15]">
                Festive <br />
                In You
              </h3>
              <Link
                href="/collections/festive"
                prefetch={true}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-[13px] font-medium text-[#1E261F] mt-6 group-hover:text-black transition"
              >
                <span>Explore Festive Collection</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0  overflow-hidden">
              <img
                src={img1.src}
                alt="Festive In You Saree Collection"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 2: Everyday Comfort */}
          <div
            className="rounded-3xl overflow-hidden relative flex items-center justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-300 hover:shadow-lg group"
            style={{
              background: 'linear-gradient(135deg, #FEEBF0 0%, #FCD8E2 50%, #F8C5D3 100%)',
            }}
          >
            <div className="p-6 sm:p-7 z-10 max-w-[58%]">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1E261F] font-normal leading-[1.15]">
                Everyday <br />
                Comfort
              </h3>
              <Link
                href="/kurtis"
                prefetch={true}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-[13px] font-medium text-[#1E261F] mt-6 group-hover:text-black transition"
              >
                <span>Shop Kurtis</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 overflow-hidden">
              <img
                src={img2.src}
                alt="Everyday Comfort Kurtis"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 3: Wedding Edit */}
          <div
            className="rounded-3xl overflow-hidden relative flex items-center justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-300 hover:shadow-lg group"
            style={{
              background: 'linear-gradient(135deg, #DFEADB 0%, #CADBC5 50%, #B8CEB2 100%)',
            }}
          >
            <div className="p-6 sm:p-7 z-10 max-w-[58%]">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1E261F] font-normal leading-[1.15]">
                Wedding <br />
                Edit
              </h3>
              <p className="text-xs text-[#3E5242] mt-1.5 font-sans">For your special days.</p>
              <Link
                href="/collections/wedding"
                prefetch={true}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-[13px] font-medium text-[#1E261F] mt-4 group-hover:text-black transition"
              >
                <span>Explore Now</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 overflow-hidden">
              <img
                src={img3.src}
                alt="Wedding Edit Royal Sarees"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST BADGES BAR (FREE SHIPPING, RETURNS, PAYMENTS, PACKAGING) */}
      {/* ========================================================================= */}
      <div className="border-y border-gray-200/70 bg-white/50 backdrop-blur-sm py-8 sm:py-9">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/60">
            {/* Free Shipping */}
            <div className="flex items-center space-x-3.5 sm:space-x-4 pl-0 sm:pl-2">
              <div className="text-[#1E2E25]">
                <Truck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#1E261F] tracking-tight">Free Shipping</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">On orders above ₹999</p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center space-x-3.5 sm:space-x-4 pt-4 sm:pt-0 pl-0 sm:pl-6 lg:pl-8">
              <div className="text-[#1E2E25]">
                <Package className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#1E261F] tracking-tight">Easy Returns</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Hassle free & quick</p>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="flex items-center space-x-3.5 sm:space-x-4 pt-4 sm:pt-0 pl-0 sm:pl-6 lg:pl-8">
              <div className="text-[#1E2E25]">
                <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#1E261F] tracking-tight">Secure Payments</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">100% safe & trusted</p>
              </div>
            </div>

            {/* Eco Friendly Packaging */}
            <div className="flex items-center space-x-3.5 sm:space-x-4 pt-4 sm:pt-0 pl-0 sm:pl-6 lg:pl-8">
              <div className="text-[#1E2E25]">
                <Gift className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.4]" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-[#1E261F] tracking-tight">Eco Friendly Packaging</h4>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Sustainable fashion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: 5-COLUMN BOUTIQUE FOOTER WITH BOTANICAL ART                      */}
      {/* ========================================================================= */}
      <div className="relative pt-14 pb-8">
        {/* Watercolor Botanical Floral Framing Left */}
        <div className="pointer-events-none absolute left-0 bottom-12 w-28 sm:w-40 md:w-48 opacity-80 z-0">
          <svg viewBox="0 0 200 350" fill="none" className="w-full h-auto">
            <path
              d="M10 320 C30 250, 20 180, 70 130 C100 100, 150 90, 180 50"
              stroke="#8FA382"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <ellipse cx="60" cy="180" rx="18" ry="32" transform="rotate(-35 60 180)" fill="#A4B999" fillOpacity="0.75" />
            <ellipse cx="90" cy="140" rx="16" ry="28" transform="rotate(40 90 140)" fill="#7E9672" fillOpacity="0.8" />
            <ellipse cx="40" cy="240" rx="20" ry="36" transform="rotate(-20 40 240)" fill="#BDCEB3" fillOpacity="0.7" />
            {/* Soft pink / blush flowers */}
            <circle cx="160" cy="70" r="16" fill="#F4BAC4" fillOpacity="0.85" />
            <circle cx="145" cy="60" r="14" fill="#E88A9C" fillOpacity="0.85" />
            <circle cx="170" cy="55" r="13" fill="#FAA7B8" fillOpacity="0.85" />
            <circle cx="155" cy="45" r="15" fill="#E26D82" fillOpacity="0.8" />
            <circle cx="157" cy="58" r="7" fill="#F8E59D" />
            {/* Lower flower */}
            <circle cx="35" cy="300" r="12" fill="#F7A8B8" fillOpacity="0.8" />
            <circle cx="25" cy="290" r="14" fill="#E76A83" fillOpacity="0.8" />
            <circle cx="45" cy="290" r="13" fill="#FAB6C4" fillOpacity="0.85" />
            <circle cx="35" cy="280" r="11" fill="#D94E68" fillOpacity="0.75" />
            <circle cx="35" cy="290" r="5" fill="#FDEBA8" />
          </svg>
        </div>

        {/* Watercolor Botanical Floral Framing Right */}
        <div className="pointer-events-none absolute right-0 top-4 w-28 sm:w-40 md:w-48 opacity-80 z-0 scale-x-[-1]">
          <svg viewBox="0 0 200 350" fill="none" className="w-full h-auto">
            <path
              d="M10 320 C30 250, 20 180, 70 130 C100 100, 150 90, 180 50"
              stroke="#8FA382"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <ellipse cx="60" cy="180" rx="18" ry="32" transform="rotate(-35 60 180)" fill="#A4B999" fillOpacity="0.75" />
            <ellipse cx="90" cy="140" rx="16" ry="28" transform="rotate(40 90 140)" fill="#7E9672" fillOpacity="0.8" />
            <ellipse cx="40" cy="240" rx="20" ry="36" transform="rotate(-20 40 240)" fill="#BDCEB3" fillOpacity="0.7" />
            {/* Flowers */}
            <circle cx="160" cy="70" r="16" fill="#F4BAC4" fillOpacity="0.85" />
            <circle cx="145" cy="60" r="14" fill="#E88A9C" fillOpacity="0.85" />
            <circle cx="170" cy="55" r="13" fill="#FAA7B8" fillOpacity="0.85" />
            <circle cx="155" cy="45" r="15" fill="#E26D82" fillOpacity="0.8" />
            <circle cx="157" cy="58" r="7" fill="#F8E59D" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12">
            {/* 1. BRAND & SOCIAL COLUMN (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3.5 pr-2">
              <Link href="/" className="inline-flex items-center space-x-3 group">
                {/* Circular Gold Emblem / Logo */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#FAF3DE] to-[#F1E4B9] border border-[#D8BE76] shadow-[0_2px_8px_rgba(216,190,118,0.25)] flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {config.logoUrl ? (
                    <img
                      src={config.logoUrl}
                      alt={config.brandName || 'Logo'}
                      className="w-10 h-10 object-cover rounded-full p-0.5"
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

                {/* Company Name & Tagline */}
                <div className="flex flex-col items-start leading-none">
                  <span className="font-serif text-[24px] sm:text-[27px] font-medium tracking-tight text-[#1C2C22] group-hover:text-[#0B4A2B] transition-colors">
                    {config.brandName || 'ANTHURIUM'}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] uppercase tracking-[0.28em] font-sans font-medium text-[#42594C] mt-1">
                    THE BOUTIQUE
                  </span>
                </div>
              </Link>

              <p className="text-xs text-gray-600 font-sans leading-relaxed pt-1">
                Indian Wear for the Modern You.
              </p>

              {/* Social Icons */}
              <div className="flex items-center space-x-3.5 pt-2 text-[#24362C]">
                <a
                  href={config.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-[18px] h-[18px]" />
                </a>
                <a
                  href={config.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-[18px] h-[18px]" />
                </a>
                {/* Pinterest */}
                <a
                  href={config.socialLinks.pinterest || 'https://pinterest.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition"
                  aria-label="Pinterest"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.368-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={config.socialLinks.youtube || 'https://youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-[19px] h-[19px]" />
                </a>
              </div>
            </div>

            {/* 2. QUICK LINKS (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#1E261F]">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-600 font-sans">
                <li>
                  <Link href="/collections/new-arrivals" prefetch={true} className="hover:text-black transition">New In</Link>
                </li>
                <li>
                  <Link href="/sarees" prefetch={true} className="hover:text-black transition">Sarees</Link>
                </li>
                <li>
                  <Link href="/kurtis" prefetch={true} className="hover:text-black transition">Kurtis</Link>
                </li>
                <li>
                  <Link href="/dresses" prefetch={true} className="hover:text-black transition">Dresses</Link>
                </li>
                <li>
                  <Link href="/sets" prefetch={true} className="hover:text-black transition">Sets</Link>
                </li>
                <li>
                  <Link href="/accessories" prefetch={true} className="hover:text-black transition">Accessories</Link>
                </li>
                <li>
                  <Link href="/stories" prefetch={true} className="hover:text-black transition">Stories</Link>
                </li>
              </ul>
            </div>

            {/* 3. HELP (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#1E261F]">Help</h4>
              <ul className="space-y-2 text-xs text-gray-600 font-sans">
                <li>
                  <Link href="/size-guide" prefetch={true} className="hover:text-black transition">Size Guide</Link>
                </li>
                <li>
                  <Link href="/shipping" prefetch={true} className="hover:text-black transition">Shipping</Link>
                </li>
                <li>
                  <Link href="/returns" prefetch={true} className="hover:text-black transition">Returns & Exchange</Link>
                </li>
                <li>
                  <Link href="/faq" prefetch={true} className="hover:text-black transition">FAQs</Link>
                </li>
                <li>
                  <Link href="/track-order" prefetch={true} className="hover:text-black transition">Track Order</Link>
                </li>
                <li>
                  <Link href="/contact" prefetch={true} className="hover:text-black transition">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* 4. OUR STORE (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#1E261F]">Our Store</h4>
              <div className="space-y-2.5 text-xs text-gray-600 font-sans">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1E2E25] shrink-0 mt-0.5" />
                  <span>Thiruchengode, Namakkal - 641001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-[#1E2E25] shrink-0" />
                  <span>Mon - Sun : 10:00 AM - 9:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#1E2E25] shrink-0" />
                  <span>{config.phone || '+91 98765 43210'}</span>
                </div>

                <div className="pt-1.5">
                  <a
                    href="https://maps.google.com/?q=Thiruchengode+Namakkal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 text-[11px] font-medium text-[#1E261F] hover:bg-gray-100 transition"
                  >
                    <span>Get Directions</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 5. JOIN OUR STYLE CIRCLE (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-[#1E261F]">Join Our Style Circle</h4>
              <p className="text-xs text-gray-500 font-sans">Get new arrivals, offers and style tips.</p>

              {subscribed ? (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#1E261F]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="bg-[#1C2C22] hover:bg-black text-white px-3.5 py-2.5 rounded-xl transition shrink-0 flex items-center justify-center shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Calligraphy / Signature Brand Quote */}
              <div className="pt-4 text-right">
                <p className="font-script text-3xl sm:text-[34px] text-[#2E4036] leading-none transform -rotate-3 select-none">
                  Stay Stylish <br />
                  Stay You ♡
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM COPYRIGHT BAR                                                      */}
          {/* ========================================================================= */}
          <div className="border-t border-gray-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 space-y-2 sm:space-y-0 font-sans">
            <p>© {new Date().getFullYear()} {config.brandName || 'ANTHURIUM'} Boutique. All rights reserved.</p>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>in Thiruchengode</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

