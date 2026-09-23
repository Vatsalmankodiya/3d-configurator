import { create } from 'zustand';
import { Product, CustomizationPart } from '../types/product';

/**
 * Product store — in-memory only.
 * Firebase Firestore is the single source of truth.
 * NO localStorage caching: products are always fetched fresh from Firestore.
 */

interface ProductState {
  products: Product[];
  selectedCategory: string;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategory: (category: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductCustomizationPart: (productId: string, partId: string, updates: Partial<CustomizationPart>) => void;
  addCustomizationPart: (productId: string, part: CustomizationPart) => void;
  deleteCustomizationPart: (productId: string, partId: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  // Always start empty — products are loaded fresh from Firestore
  products: [],
  selectedCategory: 'All',

  setProducts: (products) => set({ products }),

  setCategory: (selectedCategory) => set({ selectedCategory }),

  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products.filter((p) => p.id !== product.id)],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProductCustomizationPart: (productId, partId, updates) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          customization: {
            ...p.customization,
            parts: p.customization.parts.map((part) =>
              part.id === partId ? { ...part, ...updates } : part
            ),
          },
        };
      }),
    })),

  addCustomizationPart: (productId, part) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          customization: {
            ...p.customization,
            parts: [...p.customization.parts, part],
          },
        };
      }),
    })),

  deleteCustomizationPart: (productId, partId) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          customization: {
            ...p.customization,
            parts: p.customization.parts.filter((part) => part.id !== partId),
          },
        };
      }),
    })),
}));
