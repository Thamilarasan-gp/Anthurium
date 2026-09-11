'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../components/providers/WishlistContext';
import { useCart } from '../../components/providers/CartContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { config } = useStoreConfig();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">SAVED STYLES</span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Your Wishlist</h1>
        <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
          Save the pieces you love and move them to your bag when you're ready.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-rose-100/60 max-w-lg mx-auto space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-botanical">Save the pieces you love.</h3>
          <p className="text-xs text-gray-500">Your wishlist is currently empty. Explore our latest organza sarees and kurti sets.</p>
          <Link
            href="/shop"
            className="inline-block bg-botanical text-ivory px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-botanical-light transition"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const hasSale = product.salePrice && product.salePrice < product.price;
            return (
              <div key={product._id} className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-card flex flex-col justify-between">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover object-top" />
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-rose-600 rounded-full shadow-md"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial text-base font-bold text-botanical line-clamp-1">{product.title}</h4>
                    <p className="text-xs text-gray-400">{product.fabric}</p>
                    <div className="text-sm font-bold text-botanical mt-1">
                      {config.currency.symbol}{hasSale ? product.salePrice : product.price}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move To Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
