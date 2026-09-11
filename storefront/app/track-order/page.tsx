'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';
import { Order, OrderStatus } from '@shared/types';
import { api } from '../../lib/api';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const { config } = useStoreConfig();

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrackOrder = async (numberToTrack: string) => {
    if (!numberToTrack.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(numberToTrack.trim());
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.message || 'Order number not found.');
        setOrder(null);
      }
    } catch (err) {
      setError('Error looking up order tracking status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchTrackOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderNumberInput);
  };

  const timelineSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'packed', label: 'Packed', icon: Package },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Home }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 pb-20">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">LIVE SHIPMENT TRACKING</span>
        <h1 className="font-editorial text-4xl font-bold text-botanical">Track Your Order</h1>
        <p className="text-xs text-gray-500">Enter your order reference number (e.g. ANT-20260910-8472) to check real-time courier progress.</p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Enter Order Number (ANT-XXXX)"
          value={orderNumberInput}
          onChange={(e) => setOrderNumberInput(e.target.value)}
          required
          className="flex-1 bg-white text-xs px-4 py-3 rounded-xl border border-gray-300 focus:outline-none uppercase"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-botanical text-ivory px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-botanical-dark transition"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <p className="text-center text-xs text-rose-600 font-semibold">{error}</p>}

      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100/60 shadow-soft space-y-8 animate-fade-in">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 space-y-2 sm:space-y-0">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
              <h3 className="font-editorial text-2xl font-bold text-botanical">{order.orderNumber}</h3>
            </div>
            <div className="text-xs sm:text-right">
              <span className="font-bold text-rose-700 uppercase">{order.orderStatus.replace(/_/g, ' ')}</span>
              <p className="text-gray-400 text-[11px]">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Visual Timeline Progress Bar */}
          <div className="py-6">
            <div className="grid grid-cols-6 gap-2 text-center relative">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const IconComponent = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center space-y-2 z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted ? 'bg-botanical text-ivory shadow-lg scale-110' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isCompleted ? 'text-botanical' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details */}
          {order.trackingNumber && (
            <div className="bg-cream/60 p-4 rounded-2xl border border-rose-100 text-xs flex justify-between items-center">
              <div>
                <p className="font-bold text-botanical">Courier Partner: {order.courierName || 'Blue Dart Express'}</p>
                <p className="text-gray-500">AWB Tracking No: {order.trackingNumber}</p>
              </div>
              <span className="text-rose-700 font-bold">In Transit</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Order Tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
