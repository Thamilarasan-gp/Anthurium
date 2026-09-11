'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, Banknote, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../../components/providers/CartContext';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';
import { useAuth } from '../../components/providers/AuthContext';
import { api } from '../../lib/api';

// Helper to dynamically load official Razorpay SDK
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { config } = useStoreConfig();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || 'Coimbatore',
    state: user?.addresses?.[0]?.state || 'Tamil Nadu',
    pincode: user?.addresses?.[0]?.pincode || '641018',
    country: 'India'
  });

  // Preload Razorpay Checkout script
  React.useEffect(() => {
    loadRazorpayScript();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-botanical">Your bag is empty</h2>
        <p className="text-xs text-gray-500">Add some pieces to your bag before checking out.</p>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create order on backend (Backend recalculates prices securely!)
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          quantity: item.quantity
        })),
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country
        },
        userId: user?._id,
        guestCustomer: !user ? { name: shippingAddress.name, email: shippingAddress.email, phone: shippingAddress.phone } : undefined,
        paymentMethod
      };

      const orderRes = await api.createOrder(orderPayload);

      if (!orderRes.success || !orderRes.order) {
        setError(orderRes.message || 'Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      const createdOrder = orderRes.order;

      if (paymentMethod === 'cod') {
        clearCart();
        router.push(`/order/success?orderNumber=${createdOrder.orderNumber}`);
      } else {
        // Ensure Razorpay SDK script is loaded
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setError('Unable to load Razorpay Payment Gateway. Please check your network connection.');
          setLoading(false);
          return;
        }

        // Initialize Razorpay Order via Backend
        const paymentOrderRes = await api.createRazorpayOrder(createdOrder._id);

        if (paymentOrderRes.success && paymentOrderRes.razorpayOrder) {
          const rzpOrder = paymentOrderRes.razorpayOrder;

          const options = {
            key: rzpOrder.key,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency || 'INR',
            name: config.brandName || 'Varnika Boutique',
            description: `Order #${createdOrder.orderNumber}`,
            image: config.logoUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
            order_id: rzpOrder.id,
            handler: async function (response: any) {
              setLoading(true);
              try {
                const verifyRes = await api.verifyRazorpayPayment({
                  orderId: createdOrder._id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                });

                if (verifyRes.success) {
                  clearCart();
                  router.push(`/order/success?orderNumber=${createdOrder.orderNumber}`);
                } else {
                  setError('Payment verification failed. Please contact support.');
                  setLoading(false);
                }
              } catch (verifyErr: any) {
                setError(verifyErr.message || 'Error verifying transaction.');
                setLoading(false);
              }
            },
            prefill: {
              name: shippingAddress.name,
              email: shippingAddress.email || user?.email || '',
              contact: shippingAddress.phone || user?.phone || ''
            },
            notes: {
              orderNumber: createdOrder.orderNumber,
              address: `${shippingAddress.street}, ${shippingAddress.city}`
            },
            theme: {
              color: '#0B4A2B'
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              }
            }
          };

          const razorpayInstance = new (window as any).Razorpay(options);
          razorpayInstance.on('payment.failed', function (failResponse: any) {
            setError(failResponse.error?.description || 'Payment failed. Please try again or choose Cash on Delivery.');
            setLoading(false);
          });
          razorpayInstance.open();
        } else {
          setError(paymentOrderRes.message || 'Failed to initialize payment gateway with Razorpay.');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during checkout.');
      setLoading(false);
    }
  };

  const shippingFee = cartSubtotal >= config.freeShippingThreshold ? 0 : config.shippingFee;
  const codExtra = paymentMethod === 'cod' ? config.codFee : 0;
  const totalAmount = cartSubtotal + shippingFee + codExtra;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pb-20">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">SECURE CHECKOUT</span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-botanical">Complete Your Order</h1>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs font-semibold border border-rose-200 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Shipping Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100/60 shadow-soft space-y-4">
            <h3 className="font-editorial text-xl font-bold text-botanical">1. Shipping & Contact Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Email Address</label>
              <input
                type="email"
                required
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Street Address & Landmark</label>
              <input
                type="text"
                required
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">State</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Pincode</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100/60 shadow-soft space-y-4">
            <h3 className="font-editorial text-xl font-bold text-botanical">2. Select Payment Option</h3>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'razorpay'
                    ? 'bg-rose-50/50 border-rose-500 shadow-sm'
                    : 'bg-ivory border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="text-botanical"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-botanical">Razorpay (UPI / GPay / PhonePe / Cards / NetBanking)</h4>
                    <p className="text-[11px] text-gray-500">Fast, instant payment verification with zero extra charge.</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-botanical" />
              </label>

              {/* Cash On Delivery */}
              {config.codEnabled && (
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'bg-rose-50/50 border-rose-500 shadow-sm'
                      : 'bg-ivory border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-botanical"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-botanical">Cash On Delivery (COD)</h4>
                      <p className="text-[11px] text-gray-500">Pay cash upon doorstep delivery (+{config.currency.symbol}{config.codFee} COD fee).</p>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-emerald-700" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Order Summary & Place Order */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100/60 shadow-soft space-y-4 sticky top-28">
          <h3 className="font-editorial text-xl font-bold text-botanical border-b border-gray-100 pb-3">Items ({cartItems.length})</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-10 h-12 rounded-md object-cover" />
                  <div>
                    <h5 className="font-bold line-clamp-1">{item.product.title}</h5>
                    <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold">{config.currency.symbol}{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-charcoal/80 border-t border-gray-100 pt-3">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{config.currency.symbol}{cartSubtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'FREE' : `${config.currency.symbol}${shippingFee}`}</span></div>
            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-amber-800 font-medium">
                <span>COD Convenience Fee</span>
                <span>+{config.currency.symbol}{config.codFee}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-botanical border-t border-gray-100 pt-2">
              <span>Total Payable</span>
              <span>{config.currency.symbol}{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
