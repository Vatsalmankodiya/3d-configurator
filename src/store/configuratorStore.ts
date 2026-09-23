import { create } from 'zustand';
import { ProductConfiguration, PartConfiguration, PresetTheme } from '../types/configuration';
import { Product, CustomizationPart } from '../types/product';
import { INITIAL_PRODUCTS, PRESET_THEMES } from '../utils/constants';

export type CameraPreset = 'default' | 'front' | 'back' | 'left' | 'right' | 'top' | 'strap';

interface ConfiguratorState {
  currentProduct: Product;
  selectedPartId: string;
  hoveredPartId: string | null;
  configuration: ProductConfiguration;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  isLoadingModel: boolean;
  modelError: string | null;
  missingMeshes: string[];

  // Actions
  setProduct: (product: Product) => void;
  selectPart: (partId: string) => void;
  setHoveredPart: (partId: string | null) => void;
  setPartColor: (partId: string, color: string) => void;
  setPartRoughness: (partId: string, roughness: number) => void;
  setPartMetalness: (partId: string, metalness: number) => void;
  updatePartConfiguration: (partId: string, updates: Partial<PartConfiguration>) => void;
  resetConfiguration: () => void;
  applyPresetTheme: (theme: PresetTheme) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleAutoRotate: () => void;
  setIsLoadingModel: (loading: boolean) => void;
  setModelError: (error: string | null) => void;
  addMissingMeshWarning: (meshName: string) => void;
  loadConfiguration: (config: ProductConfiguration) => void;
}

// Generate default configuration from product definitions
const getDefaultConfiguration = (product: Product): ProductConfiguration => {
  const config: ProductConfiguration = {};
  product.customization.parts.forEach((part) => {
    config[part.id] = {
      color: part.defaultColor,
      roughness: part.defaultRoughness,
      metalness: part.defaultMetalness ?? (part.id.includes('metal') || part.id.includes('logo') || part.id.includes('zipper') ? 0.85 : 0.05)
    };
  });
  return config;
};

const defaultProduct = INITIAL_PRODUCTS[0];

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  currentProduct: defaultProduct,
  selectedPartId: defaultProduct.customization.parts[0]?.id || 'bag_main_body',
  hoveredPartId: null,
  configuration: getDefaultConfiguration(defaultProduct),
  cameraPreset: 'default',
  autoRotate: false,
  isLoadingModel: false,
  modelError: null,
  missingMeshes: [],

  setProduct: (product) => {
    const defaultConfig = getDefaultConfiguration(product);
    set({
      currentProduct: product,
      selectedPartId: product.customization.parts[0]?.id || 'bag_main_body',
      configuration: defaultConfig,
      cameraPreset: 'default',
      missingMeshes: []
    });
  },

  selectPart: (partId) => {
    const part = get().currentProduct.customization.parts.find(p => p.id === partId);
    let cameraPreset: CameraPreset = get().cameraPreset;
    if (part && part.cameraAngle) {
      cameraPreset = part.cameraAngle;
    }
    set({ selectedPartId: partId, cameraPreset });
  },

  setHoveredPart: (partId) => set({ hoveredPartId: partId }),

  setPartColor: (partId, color) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        [partId]: {
          ...(state.configuration[partId] || { roughness: 0.5, metalness: 0.1 }),
          color
        }
      }
    }));
  },

  setPartRoughness: (partId, roughness) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        [partId]: {
          ...(state.configuration[partId] || { color: '#111827', metalness: 0.1 }),
          roughness
        }
      }
    }));
  },

  setPartMetalness: (partId, metalness) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        [partId]: {
          ...(state.configuration[partId] || { color: '#111827', roughness: 0.5 }),
          metalness
        }
      }
    }));
  },

  updatePartConfiguration: (partId, updates) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        [partId]: {
          ...(state.configuration[partId] || { color: '#111827', roughness: 0.5, metalness: 0.1 }),
          ...updates
        }
      }
    }));
  },

  resetConfiguration: () => {
    const product = get().currentProduct;
    set({
      configuration: getDefaultConfiguration(product),
      cameraPreset: 'default'
    });
  },

  applyPresetTheme: (theme) => {
    set((state) => ({
      configuration: {
        ...state.configuration,
        ...theme.configuration
      }
    }));
  },

  setCameraPreset: (cameraPreset) => set({ cameraPreset }),

  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

  setIsLoadingModel: (isLoadingModel) => set({ isLoadingModel }),

  setModelError: (modelError) => set({ modelError }),

  addMissingMeshWarning: (meshName) => {
    set((state) => {
      if (state.missingMeshes.includes(meshName)) return state;
      return { missingMeshes: [...state.missingMeshes, meshName] };
    });
  },

  loadConfiguration: (configuration) => set({ configuration })
}));
