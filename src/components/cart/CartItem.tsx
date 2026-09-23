import React from 'react';
import { CartItem as CartItemType } from '../../types/order';
import { useCartStore } from '../../store/cartStore';
import { Trash2, Plus, Minus, Layers } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCartStore();

  const configEntries = Object.entries(item.configuration);

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-slate-900 font-heading">
            {item.productName}
          </h4>
          <p className="text-xs font-black text-red-600 mt-0.5 font-mono">
            ${item.price}
          </p>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Configuration Summary Badges */}
      {configEntries.length > 0 && (
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1.5 text-[11px]">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-red-600" />
            Custom 3D Configuration:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {configEntries.slice(0, 5).map(([partId, partConfig]) => (
              <span
                key={partId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[10px] shadow-2xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                  style={{ backgroundColor: partConfig.color }}
                />
                <span className="capitalize">{partId.replace('bag_', '').replace('_', ' ')}</span>
              </span>
            ))}
            {configEntries.length > 5 && (
              <span className="text-[10px] text-slate-400 font-mono self-center font-medium">
                +{configEntries.length - 5} more parts
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quantity Selector & Subtotal */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-mono font-bold text-slate-900">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="font-bold text-slate-900 font-mono">
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
