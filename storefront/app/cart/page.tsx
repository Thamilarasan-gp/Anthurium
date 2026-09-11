'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../../components/providers/CartContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { config } = useStoreConfig();

  const freeThreshold = config.freeShippingThreshold || 2999;
  const shippingFee = cartSubtotal >= freeThreshold ? 0 : config.shippingFee || 150;
  const grandTotal = cartSubtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">SHOPPING BAG</span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Review Your Items</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-rose-100/60 max-w-lg mx-auto space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-botanical">Your bag is waiting for something beautiful.</h3>
          <p className="text-xs text-gray-500">Explore our organza sarees, chanderi kurtis, and festive edits.</p>
          <Link
            href="/shop"
            className="inline-block bg-botanical text-ivory px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-botanical-light transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-2xl border border-rose-100/60 flex space-x-4 shadow-sm">
                <img src={item.product.images[0]} alt={item.product.title} className="w-24 h-32 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-editorial text-base font-bold text-botanical">{item.product.title}</h4>
                      <button onClick={() => removeFromCart(item._id!)} className="text-gray-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{item.product.fabric}</p>
                    {item.selectedSize && <span className="text-xs text-rose-700 font-semibold">Size: {item.selectedSize}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border rounded-lg bg-gray-50 px-2 py-1 space-x-2">
                      <button onClick={() => updateQuantity(item._id!, item.quantity - 1)} className="text-gray-600 hover:text-botanical">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id!, item.quantity + 1)} className="text-gray-600 hover:text-botanical">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-botanical">{config.currency.symbol}{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white p-6 rounded-3xl border border-rose-100/60 shadow-soft space-y-4 sticky top-28">
            <h3 className="font-editorial text-xl font-bold text-botanical border-b border-gray-100 pb-3">Order Summary</h3>
            <div className="space-y-2 text-xs text-charcoal/80">
              <div className="flex justify-between"><span>Bag Subtotal</span><span className="font-bold">{config.currency.symbol}{cartSubtotal}</span></div>
              <div className="flex justify-between"><span>Estimated Delivery</span><span>{shippingFee === 0 ? 'FREE' : `${config.currency.symbol}${shippingFee}`}</span></div>
              <div className="flex justify-between text-sm font-bold text-botanical border-t border-gray-100 pt-3">
                <span>Grand Total</span>
                <span>{config.currency.symbol}{grandTotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay & COD Guaranteed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
