'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/adminApi';
import { Order } from '@shared/types';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [courierName, setCourierName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await adminApi.getOrderById(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
          setOrderStatus(res.order.orderStatus);
          setTrackingNumber(res.order.trackingNumber || '');
          setCourierName(res.order.courierName || '');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      const res = await adminApi.updateOrderStatus(orderId, orderStatus, trackingNumber, courierName);
      if (res.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 4000);
      } else {
        alert(res.message || 'Failed to update order');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
        <p className="text-sm">Loading Order #{orderId}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center text-slate-300 space-y-4">
        <p className="text-base font-semibold">Order not found.</p>
        <Link href="/orders" className="text-xs text-emerald-400 underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Link
            href="/orders"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white font-mono">{order.orderNumber}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
              </span>
            </p>
          </div>
        </div>
      </div>

      {updateSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>Order fulfillment details and status updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items & Pricing Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 sm:p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Purchased Items ({order.items?.length || 0})</span>
            </h2>

            <div className="divide-y divide-[#334155]/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 text-sm truncate">{item.productTitle}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && (
                          <span className="flex items-center space-x-1">
                            <span>Color:</span>
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-slate-600"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-white text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-slate-500">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#334155] space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700/60">
                <span>Total Amount Paid / Payable</span>
                <span className="text-emerald-400">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Shipping Address, Payment, & Status Update Form */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Fulfillment & Logistics</span>
            </h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Change Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. BlueDart / Delhivery"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD78391204IN"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-200 text-xs sm:text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-60 cursor-pointer mt-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Logistics Update</span>
              </button>
            </form>
          </div>

          {/* Customer & Shipping Info */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Shipping Address</span>
            </h2>

            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-slate-100 text-sm">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p>{order.shippingAddress?.country || 'India'}</p>
              <p className="pt-2 text-slate-400">
                Phone: <span className="font-mono text-slate-200">{order.shippingAddress?.phone}</span>
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Details</span>
            </h2>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold uppercase text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span
                  className={`font-semibold uppercase ${
                    order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>Razorpay ID:</span>
                  <span>{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
