import React from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { ShoppingBag, ArrowRight, ShieldCheck, Box } from 'lucide-react';

interface CartPageProps {
  setActiveTab: (tab: 'home' | 'products' | 'configurator' | 'saved' | 'cart' | 'admin') => void;
  onProceedToCheckout: () => void;
}

export const Cart: React.FC<CartPageProps> = ({ setActiveTab, onProceedToCheckout }) => {
  const { items, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 py-12 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-lg">
          <ShoppingBag className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Your Cart Locker is Empty</h2>
          <p className="text-xs text-slate-500">
            You haven't added any custom 3D golf bags to your cart yet. Build your personalized bag in the 3D studio!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('configurator')}
          className="btn-primary text-sm py-3 px-6"
        >
          <Box className="w-4 h-4" />
          <span>Launch 3D Configurator</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 font-heading">Shopping Cart Locker</h1>
        <p className="text-xs text-slate-500">Review your bespoke custom configurations prior to checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary Right Card */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-6 space-y-6 sticky top-28 bg-white border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Custom Items Subtotal</span>
                <span className="font-mono text-slate-900 font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Insured Express Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>PGA Tour Guarantee</span>
                <span className="text-emerald-600 font-semibold">Included</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono text-red-600 font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="btn-primary w-full py-4 text-sm font-semibold shadow-xl shadow-red-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted Data Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
