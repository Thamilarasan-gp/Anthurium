'use client';

import React from 'react';
import Link from 'next/link';
import { X, Heart, Eye, ShoppingBag, Instagram, Sparkles } from 'lucide-react';
import { Story, Product } from '@shared/types';
import { useCart } from '../providers/CartContext';
import { useStoreConfig } from '../providers/StoreConfigContext';

interface InstagramDrawerProps {
  story: Story | null;
  onClose: () => void;
}

export const InstagramDrawer: React.FC<InstagramDrawerProps> = ({ story, onClose }) => {
  const { addToCart } = useCart();
  const { config } = useStoreConfig();

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-ivory rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row z-10 border border-rose-100/30 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Media Player / Image */}
        <div className="md:w-1/2 relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          {story.mediaType === 'video' ? (
            <video
              src={story.mediaUrl}
              poster={story.thumbnailUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={story.mediaUrl}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Social Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 text-white flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-rose-300" />
                <span>{story.viewsCount ? (story.viewsCount / 1000).toFixed(1) + 'K' : '12.4K'} views</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>{story.likesCount ? (story.likesCount / 1000).toFixed(1) + 'K' : '1.8K'}</span>
              </span>
            </div>
            <a
              href={story.instagramUrl || config.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-rose-300 hover:text-white transition font-medium"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>View Reel</span>
            </a>
          </div>
        </div>

        {/* Right: Tagged Outfit Items ("Shop This Look") */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-ivory">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-rose-700 font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>SHOP THIS LOOK</span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-botanical mb-2">
              {story.title}
            </h3>

            <p className="text-xs text-charcoal/70 leading-relaxed mb-6 font-light">
              {story.caption || 'Discover handcrafted Indian elegance inspired by real customer styling stories.'}
            </p>

            <h4 className="text-xs uppercase tracking-widest font-semibold text-botanical mb-3 border-b border-rose-100 pb-2">
              Featured Outfit Pieces ({story.linkedProducts.length})
            </h4>

            {/* Linked Products */}
            <div className="space-y-3.5">
              {story.linkedProducts.map((prodItem: any) => {
                const product: Product = typeof prodItem === 'object' ? prodItem : null;
                if (!product) return null;

                const hasSale = product.salePrice && product.salePrice < product.price;

                return (
                  <div
                    key={product._id}
                    className="bg-white p-3 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-14 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="font-editorial text-sm font-semibold text-charcoal hover:text-rose-700 transition line-clamp-1"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-gray-500 font-medium">
                          {product.fabric}
                        </p>
                        <div className="text-xs font-bold text-botanical mt-0.5">
                          {config.currency.symbol}
                          {hasSale ? product.salePrice : product.price}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        onClose();
                      }}
                      className="bg-botanical hover:bg-botanical-dark text-ivory p-2.5 rounded-xl text-xs font-semibold uppercase flex items-center space-x-1 transition shrink-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 text-center border-t border-rose-100/60 mt-6">
            <Link
              href="/stories"
              onClick={onClose}
              className="text-xs text-rose-700 hover:text-botanical font-semibold uppercase tracking-wider underline"
            >
              Explore All Instagram Styling Reels →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
