'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Home,
  Copy,
  Check,
  Search,
  ExternalLink,
  Shield,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../components/providers/AuthContext';
import { useWishlist } from '../../components/providers/WishlistContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';
import { Order, OrderStatus } from '@shared/types';
import { api } from '../../lib/api';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const { config } = useStoreConfig();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);

  // Tracking state for dedicated lookup
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Expanded tracking state on individual cards
  const [expandedTrackingId, setExpandedTrackingId] = useState<string | null>(null);

  // Order filter tab
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Link guest order state
  const [linkOrderInput, setLinkOrderInput] = useState('');
  const [linkOrderLoading, setLinkOrderLoading] = useState(false);
  const [linkOrderMessage, setLinkOrderMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const res = await api.getMyOrders();
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrderNumber(num);
    setTimeout(() => setCopiedOrderNumber(null), 2500);
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumberInput.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackedOrder(null);

    try {
      const res = await api.trackOrder(trackingNumberInput.trim());
      if (res.success && res.order) {
        setTrackedOrder(res.order);
      } else {
        setTrackingError(res.message || 'Order reference not found. Please verify the order number.');
      }
    } catch (err: any) {
      setTrackingError('Unable to fetch live tracking details.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleLinkOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkOrderInput.trim()) return;

    setLinkOrderLoading(true);
    setLinkOrderMessage(null);

    try {
      const res = await api.linkOrder(linkOrderInput.trim());
      if (res.success) {
        setLinkOrderMessage({ type: 'success', text: res.message || 'Order successfully linked!' });
        setLinkOrderInput('');
        fetchOrders();
      } else {
        setLinkOrderMessage({ type: 'error', text: res.message || 'Could not link order with this reference number.' });
      }
    } catch (err: any) {
      setLinkOrderMessage({ type: 'error', text: err.message || 'Error linking order.' });
    } finally {
      setLinkOrderLoading(false);
    }
  };

  const timelineSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Placed', icon: Clock },
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

  // Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-amber-100 text-amber-900 border-amber-200 animate-pulse';
      case 'shipped':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'confirmed':
      case 'processing':
      case 'packed':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'cancelled':
      case 'returned':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100/70 border border-rose-200 mx-auto flex items-center justify-center text-rose-700">
          <User className="w-8 h-8 stroke-[1.6]" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-rose-700">ACCOUNT ACCESS</span>
          <h2 className="font-editorial text-3xl font-bold text-botanical mt-1">Please Sign In</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Sign in to view your orders, live shipment tracking, saved boutique favorites, and exclusive customer privileges.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 bg-botanical hover:bg-botanical-dark text-ivory px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center space-x-1.5 bg-white border border-gray-300 text-charcoal px-5 py-3 rounded-full text-xs font-semibold hover:bg-gray-50 transition"
          >
            <Truck className="w-4 h-4 text-rose-600" />
            <span>Track Guest Order</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculated Stats
  const totalSpent = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(o.orderStatus)
  );
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');

  // Filtered orders list
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'active') {
      return ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(ord.orderStatus);
    }
    if (orderFilter === 'delivered') {
      return ord.orderStatus === 'delivered';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 pb-24">
      {/* ========================================================================= */}
      {/* 1. PROFILE HEADER & ACTIONS                                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-rose-100 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#FAF3DE] to-[#F1E4B9] border-2 border-[#D8BE76] shadow-[0_4px_12px_rgba(216,190,118,0.3)] flex items-center justify-center flex-shrink-0">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={user.name}
                className="w-full h-full object-cover rounded-full p-0.5"
              />
            ) : (
              <span className="font-serif font-bold text-2xl text-[#8E6D24]">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-700">
                CUSTOMER DASHBOARD
              </span>
              {isAdmin && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-botanical">
              Welcome back, {user.name} ♡
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              {user.email} {user.phone ? `• ${user.phone}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          {isAdmin && (
            <a
              href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold hover:bg-emerald-100 transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </a>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-semibold transition border border-rose-200/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS & SUMMARY METRICS GRID                                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100/70 shadow-soft relative overflow-hidden group hover:border-rose-300 transition">
          <div className="flex justify-between items-center text-rose-700 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">Total Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-700">
              <Package className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-botanical font-editorial">{orders.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Lifetime boutique purchases</p>
        </div>

        {/* Active Shipments */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100/70 shadow-soft relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex justify-between items-center text-amber-700 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">In Transit</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Truck className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-botanical font-editorial">{activeOrders.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Active deliveries on the way</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100/70 shadow-soft relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex justify-between items-center text-emerald-700 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">Total Spent</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-botanical font-editorial">
            {config.currency.symbol}{totalSpent.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Tier: Anthurium Privilege</p>
        </div>

        {/* Wishlist Saved Items */}
        <Link
          href="/wishlist"
          className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-100/70 shadow-soft relative overflow-hidden group hover:border-rose-400 hover:shadow-md transition block"
        >
          <div className="flex justify-between items-center text-rose-600 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">Wishlist</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition">
              <Heart className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-botanical font-editorial">{wishlist.length}</p>
          <p className="text-[11px] text-rose-700 font-medium mt-1 inline-flex items-center space-x-1">
            <span>View Saved Styles</span>
            <span>→</span>
          </p>
        </Link>
      </div>



      {/* ========================================================================= */}
      {/* 4. RECENT ORDERS SECTION                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100/70 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-700">ORDER HISTORY</span>
            <h3 className="font-editorial text-2xl font-bold text-botanical">Recent Purchases</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-gray-100/70 p-1 rounded-full text-xs self-start sm:self-auto">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1 rounded-full font-semibold transition ${orderFilter === 'all' ? 'bg-white text-botanical shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('active')}
              className={`px-3 py-1 rounded-full font-semibold transition ${orderFilter === 'active' ? 'bg-white text-botanical shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setOrderFilter('delivered')}
              className={`px-3 py-1 rounded-full font-semibold transition ${orderFilter === 'delivered' ? 'bg-white text-botanical shadow-xs' : 'text-gray-500 hover:text-black'
                }`}
            >
              Delivered ({deliveredOrders.length})
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingOrders ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-rose-600 mx-auto" />
            <p className="text-xs text-gray-500">Loading your boutique orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-14 space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#1C2C22]">No Orders Found</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {orderFilter === 'all'
                  ? "You haven't placed any orders yet with this account."
                  : `No ${orderFilter} orders found.`}
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-block bg-botanical hover:bg-botanical-dark text-ivory px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((ord) => {
              const isTrackingExpanded = expandedTrackingId === ord._id;
              const stepIdx = getStepIndex(ord.orderStatus);

              return (
                <div
                  key={ord._id}
                  className="rounded-2xl border border-gray-200/80 bg-white hover:border-rose-300 transition overflow-hidden shadow-xs"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 bg-ivory/40 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-sm sm:text-base text-botanical">
                            {ord.orderNumber}
                          </span>
                          <button
                            onClick={() => handleCopyOrderNumber(ord.orderNumber)}
                            title="Copy Order Number"
                            className="p-1 text-gray-400 hover:text-black transition"
                          >
                            {copiedOrderNumber === ord.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Placed on{' '}
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      {/* Payment Status Pill */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ord.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                      >
                        {ord.paymentStatus === 'paid' ? 'Paid' : ord.paymentMethod === 'cod' ? 'COD Pending' : 'Payment Pending'}
                      </span>

                      {/* Order Status Pill */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Items List */}
                  <div className="p-4 sm:p-5 divide-y divide-gray-100">
                    {ord.items.map((item, i) => {
                      const prodTitle = item.productTitle || (typeof item.product === 'object' ? (item.product as any)?.title : 'Boutique Product');
                      const prodImg = item.productImage || (typeof item.product === 'object' ? (item.product as any)?.images?.[0] : null);

                      return (
                        <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-warm-beige/50 overflow-hidden border border-gray-100 shrink-0">
                              {prodImg ? (
                                <img
                                  src={prodImg}
                                  alt={prodTitle}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-semibold text-xs sm:text-sm text-[#1C2C22] line-clamp-1">
                                {prodTitle}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mt-1">
                                {item.selectedSize && (
                                  <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-700">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor?.name && (
                                  <span className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-700">
                                    <span
                                      className="w-2 h-2 rounded-full border border-black/10"
                                      style={{ backgroundColor: item.selectedColor.hex }}
                                    />
                                    <span>{item.selectedColor.name}</span>
                                  </span>
                                )}
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-bold text-xs sm:text-sm text-botanical">
                              {config.currency.symbol}{item.price * item.quantity}
                            </span>
                            <p className="text-[10px] text-gray-400">
                              ({config.currency.symbol}{item.price} each)
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer: Summary & Interactive Tracking Toggle */}
                  <div className="p-4 sm:p-5 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-gray-400">Ship to: </span>
                      <span className="font-semibold text-[#1C2C22]">{ord.shippingAddress?.name || user.name}</span>
                      <span className="text-gray-400"> • {ord.shippingAddress?.city || 'Coimbatore'}, {ord.shippingAddress?.pincode}</span>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right mr-2">
                        <span className="text-[10px] text-gray-400 block leading-none">Order Total</span>
                        <span className="font-bold text-sm sm:text-base text-botanical font-editorial">
                          {config.currency.symbol}{ord.totalAmount}
                        </span>
                      </div>

                      {/* Interactive Track Toggle */}
                      <button
                        onClick={() => setExpandedTrackingId(isTrackingExpanded ? null : ord._id)}
                        className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${isTrackingExpanded
                            ? 'bg-[#0B4A2B] text-white shadow-xs'
                            : 'bg-white border border-gray-300 text-botanical hover:bg-emerald-50'
                          }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isTrackingExpanded ? 'Hide Status' : 'Track Order'}</span>
                        {isTrackingExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <Link
                        href={`/track-order?orderNumber=${ord.orderNumber}`}
                        className="p-1.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition"
                        title="Open Dedicated Tracking Window"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Collapsible Live Shipment Stepper */}
                  {isTrackingExpanded && (
                    <div className="p-5 sm:p-6 bg-cream/40 border-t border-rose-100 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-botanical uppercase tracking-wider">
                          Shipment Status: {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                        {ord.courierName && (
                          <span className="text-gray-500">
                            Partner: <strong className="text-black">{ord.courierName}</strong>
                            {ord.trackingNumber ? ` (${ord.trackingNumber})` : ''}
                          </span>
                        )}
                      </div>

                      <div className="py-2">
                        <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center relative">
                          {timelineSteps.map((step, idx) => {
                            const isCompleted = idx <= stepIdx;
                            const Icon = step.icon;

                            return (
                              <div key={step.status} className="flex flex-col items-center space-y-1.5 z-10">
                                <div
                                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${isCompleted
                                      ? 'bg-[#0B4A2B] text-white shadow-xs scale-105'
                                      : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span
                                  className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-tight ${isCompleted ? 'text-botanical' : 'text-gray-400'
                                    }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. LINK GUEST ORDER TOOL                                                 */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-gray-100">
          <div className="bg-rose-50/40 p-4 sm:p-5 rounded-2xl border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-[#1C2C22]">Missing an order placed as a guest?</h5>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Link any past order placed before signing in by entering its reference number.
              </p>
            </div>

            <form onSubmit={handleLinkOrderSubmit} className="flex gap-2 max-w-sm w-full">
              <input
                type="text"
                placeholder="e.g. ANT-20260910-5370"
                value={linkOrderInput}
                onChange={(e) => setLinkOrderInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-gray-300 text-xs uppercase font-mono tracking-wider focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={linkOrderLoading}
                className="bg-[#0B4A2B] hover:bg-[#07361E] text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition shrink-0 disabled:opacity-50"
              >
                {linkOrderLoading ? 'Linking...' : 'Link Order'}
              </button>
            </form>
          </div>

          {linkOrderMessage && (
            <p
              className={`text-xs font-semibold mt-2 ${linkOrderMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
                }`}
            >
              {linkOrderMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
