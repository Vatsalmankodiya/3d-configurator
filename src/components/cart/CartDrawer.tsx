import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from './CartItem';
import { X, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { items, isOpen, closeCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading text-slate-900">Your Cart Locker</h3>
                <p className="text-xs text-slate-500">{items.length} Custom Equipment Order(s)</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 mt-1">Design your custom 3D golf bag in the studio!</p>
                </div>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} />)
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 space-y-4 bg-white">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Insured Express Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="font-mono text-red-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="btn-primary w-full py-3.5 text-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Order & Firebase Protection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
