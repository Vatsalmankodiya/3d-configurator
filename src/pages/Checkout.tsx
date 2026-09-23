import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../firebase/orders';
import { CheckCircle2, Box } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutProps {
  setActiveTab: (tab: 'home' | 'products' | 'configurator' | 'saved' | 'cart' | 'admin') => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ setActiveTab }) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    fullName: 'Alexander Vance',
    email: 'pro.golfer@apexgolf.com',
    address: '100 Pebble Beach Boulevard',
    city: 'Monterey',
    postalCode: '93953',
    country: 'United States'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        items,
        totalAmount: totalPrice,
        paymentStatus: 'paid',
        orderStatus: 'processing',
        customerInfo: formData,
        createdAt: new Date().toISOString()
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompletedOrderId(orderId);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrderId) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xl">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="badge badge-emerald">Order Confirmed & Placed</span>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-slate-500">
            Order Reference ID: <span className="font-mono text-red-600 font-bold">{completedOrderId}</span>
          </p>
        </div>

        <div className="glass-panel p-6 text-left space-y-4 text-xs bg-white border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Shipping Recipient:</span>
            <span className="text-slate-900 font-medium">{formData.fullName} ({formData.email})</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Delivery Address:</span>
            <span className="text-slate-900 font-medium">{formData.address}, {formData.city}, {formData.postalCode}</span>
          </div>
          <div className="flex items-center justify-between font-bold text-sm text-slate-900 pt-1">
            <span>Total Paid:</span>
            <span className="font-mono text-red-600 font-black">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Your custom 3D material configuration JSON has been saved in Firestore. Our master craftsmen will begin tailoring your bag.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('home')}
            className="btn-secondary text-xs"
          >
            Return to Home
          </button>
          <button
            onClick={() => setActiveTab('configurator')}
            className="btn-primary text-xs"
          >
            <Box className="w-4 h-4" />
            <span>Customize Another Bag</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 font-heading">Secure Checkout</h1>
        <p className="text-xs text-slate-500">Enter delivery information to complete your custom bag order</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-4 bg-white border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
              Shipping & Customer Details
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Order Overview */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 space-y-6 sticky top-28 bg-white border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
              Order Summary ({items.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                  <div>
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-red-600 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-bold text-slate-900">
              <span>Total Payment:</span>
              <span className="font-mono text-red-600 font-black">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="btn-primary w-full py-4 text-sm font-bold shadow-xl shadow-red-600/20"
            >
              {isSubmitting ? 'Processing Order...' : 'Complete Order & Save Configuration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
