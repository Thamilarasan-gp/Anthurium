'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../providers/CartContext';
import { useStoreConfig } from '../providers/StoreConfigContext';
import { api } from '../../lib/api';

export const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, closeCart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { config } = useStoreConfig();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeThreshold = config.freeShippingThreshold || 2999;
  const remainingForFreeShipping = Math.max(0, freeThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');

    try {
      const res = await api.validateCoupon(couponCode, cartSubtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponError('');
      } else {
        setCouponError(res.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Error validating coupon');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const estimatedShipping = cartSubtotal >= freeThreshold ? 0 : config.shippingFee || 150;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + estimatedShipping);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeCart} />

      {/* Sliding Panel */}
      <div className="relative bg-ivory w-full max-w-md h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-rose-100/60 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-botanical" />
            <h3 className="font-editorial text-xl font-bold text-botanical">Your Shopping Bag</h3>
            <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
              {cartItems.length}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 text-charcoal hover:text-rose-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-cream/70 p-3.5 border-b border-rose-100 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-charcoal/80 mb-1.5 font-medium">
              Add <span className="font-bold text-rose-700">{config.currency.symbol}{remainingForFreeShipping}</span> more to unlock <span className="font-bold uppercase tracking-wider text-botanical">FREE SHIPPING</span>!
            </p>
          ) : (
            <p className="text-emerald-800 font-bold mb-1.5 flex items-center space-x-1">
              <span>🎉 Congratulations! You have unlocked FREE Express Shipping!</span>
            </p>
          )}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-botanical h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-charcoal/60">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-editorial text-xl font-semibold text-botanical">
                Your bag is waiting for something beautiful.
              </h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Explore our handcrafted organza sarees, chanderi kurtis, and festive edits.
              </p>
              <button
                onClick={closeCart}
                className="bg-botanical text-ivory px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-botanical-light transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-3.5 rounded-xl border border-rose-100/50 flex space-x-3.5 shadow-sm"
              >
                {/* Item Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-bold text-charcoal truncate pr-2">
                        {item.product.title}
                      </h5>
                      <button
                        onClick={() => removeFromCart(item._id!)}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-500 space-x-2 mt-0.5">
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && (
                        <span>Color: <strong>{item.selectedColor.name}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-botanical"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-botanical"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-botanical">
                      {config.currency.symbol}
                      {item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-rose-100/60 bg-white space-y-3">
            {/* Coupon Code input */}
            <form onSubmit={handleApplyCoupon} className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter Promo Coupon (e.g. BLOOM10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-ivory text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="bg-botanical text-ivory text-xs px-4 py-2 rounded-lg font-semibold uppercase hover:bg-botanical-light transition"
              >
                Apply
              </button>
            </form>
            {appliedCoupon && (
              <p className="text-xs text-emerald-700 font-medium flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{config.currency.symbol}{discountAmount})</span>
              </p>
            )}
            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-charcoal/80 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{config.currency.symbol}{cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span>-{config.currency.symbol}{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{estimatedShipping === 0 ? 'FREE' : `${config.currency.symbol}${estimatedShipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-botanical border-t border-gray-100 pt-2">
                <span>Total Amount</span>
                <span>{config.currency.symbol}{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout with Razorpay & UPI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
