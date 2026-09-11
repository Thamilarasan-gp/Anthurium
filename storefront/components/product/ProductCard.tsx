'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, MessageCircle, Star, Check } from 'lucide-react';
import { Product } from '@shared/types';
import { useCart } from '../providers/CartContext';
import { useWishlist } from '../providers/WishlistContext';
import { useStoreConfig } from '../providers/StoreConfigContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { config } = useStoreConfig();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);

  const isLiked = isInWishlist(product._id);
  const hasSale = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = () => {
    setHeartPulsing(true);
    toggleWishlist(product);
    setTimeout(() => setHeartPulsing(false), 300);
  };

  const whatsappMsg = `Hi ${config.brandName}, I'm interested in buying: ${product.title} (SKU: ${product.sku}). Price: ${config.currency.symbol}${hasSale ? product.salePrice : product.price}.`;
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 border border-rose-100/40 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-warm-beige/30">
        <Link href={`/product/${product.slug}`} prefetch={true}>
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
          {product.badges?.map((badge) => {
            let badgeBg = 'bg-botanical text-ivory';
            if (badge === 'Sale') badgeBg = 'bg-rose-600 text-white';
            if (badge === 'New') badgeBg = 'bg-sage text-botanical-dark font-bold';
            if (badge === 'Bestseller') badgeBg = 'bg-amber-600 text-white';
            if (badge === 'Limited') badgeBg = 'bg-terracotta text-white';

            return (
              <span
                key={badge}
                className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold shadow-sm ${badgeBg}`}
              >
                {badge}
              </span>
            );
          })}
          {hasSale && !product.badges?.includes('Sale') && (
            <span className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold bg-rose-600 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button with Micro-Interaction */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-md ${
            heartPulsing ? 'scale-125' : 'scale-100'
          } ${
            isLiked
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-charcoal/70 hover:bg-white hover:text-rose-600'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Add to Cart Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className={`flex-1 text-ivory py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center justify-center space-x-1.5 transition-all transform active:scale-95 ${
              justAdded ? 'bg-emerald-700' : 'bg-botanical hover:bg-botanical-dark'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white animate-fadeIn" />
                <span className="text-white">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add To Bag</span>
              </>
            )}
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2.5 bg-white/90 hover:bg-white text-botanical rounded-xl shadow-lg transition"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
          </a>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          {/* Colors Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 mb-1.5">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-black/10 shadow-inner inline-block"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <span className="text-[10px] text-gray-400 font-medium">
                {product.fabric}
              </span>
            </div>
          )}

          {/* Title */}
          <Link href={`/product/${product.slug}`} prefetch={true} className="group-hover:text-rose-700 transition">
            <h3 className="font-editorial text-base font-semibold text-charcoal line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-bold text-botanical">
              {config.currency.symbol}
              {hasSale ? product.salePrice : product.price}
            </span>
            {hasSale && (
              <span className="text-xs text-gray-400 line-through">
                {config.currency.symbol}
                {product.price}
              </span>
            )}
          </div>

          <div className="flex items-center text-[11px] text-amber-600 font-semibold space-x-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating || 4.8}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
