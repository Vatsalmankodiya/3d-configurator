import { create } from 'zustand';
import { CartItem } from '../types/order';
import { ProductConfiguration } from '../types/configuration';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (product: { id: string; name: string; price: number; thumbnailUrl: string }, configuration: ProductConfiguration) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    {
      id: 'cart-sample-1',
      productId: 'apex-tour-pro-01',
      productName: 'Apex Tour Pro Staff Bag',
      price: 349,
      quantity: 1,
      thumbnailUrl: '/images/products/tour-pro-thumb.jpg',
      addedAt: new Date().toISOString(),
      configuration: {
        bag_main_body: { color: '#111827', roughness: 0.45 },
        bag_front_pocket: { color: '#b91c1c', roughness: 0.5 },
        bag_strap: { color: '#1e293b', roughness: 0.65 }
      }
    }
  ],
  isOpen: false,

  addItem: (product, configuration) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      thumbnailUrl: product.thumbnailUrl,
      addedAt: new Date().toISOString(),
      configuration: JSON.parse(JSON.stringify(configuration))
    };

    set((state) => ({
      items: [newItem, ...state.items],
      isOpen: true
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    }));
  },

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
