'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';
import { Order, OrderItem } from '@shared/types';
import { api } from '../../../lib/api';
import { useStoreConfig } from '../../../components/providers/StoreConfigContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const { config } = useStoreConfig();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      api.trackOrder(orderNumber).then((res) => {
        if (res.success && res.order) {
          setOrder(res.order);
        }
      });
    }
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 pb-20">
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">ORDER CONFIRMED</span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Your order is confirmed ♡</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Thank you for choosing Anthurium. We are preparing your handcrafted ensemble for dispatch.
        </p>
      </div>

      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100/60 shadow-soft text-left space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
              <h4 className="font-bold text-base text-botanical">{order.orderNumber}</h4>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase">
              {order.orderStatus}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-3 border-b border-gray-100 pb-4">
            {order.items.map((item: OrderItem, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.productImage} alt={item.productTitle} className="w-12 h-14 rounded-lg object-cover" />
                  <div>
                    <h5 className="font-bold text-charcoal">{item.productTitle}</h5>
                    <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-botanical">{config.currency.symbol}{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-charcoal/80">
            <span>Shipping Address: <strong>{order.shippingAddress.name}, {order.shippingAddress.city}</strong></span>
            <span className="font-bold text-botanical text-sm">Total: {config.currency.symbol}{order.totalAmount}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {orderNumber && (
          <Link
            href={`/track-order?orderNumber=${orderNumber}`}
            className="bg-botanical hover:bg-botanical-dark text-ivory px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition flex items-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>
        )}
        <Link
          href="/shop"
          className="bg-white text-botanical border border-gray-200 hover:bg-rose-50 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Confirming your order...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
