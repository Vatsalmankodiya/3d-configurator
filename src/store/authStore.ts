import { create } from 'zustand';
import { SavedConfiguration } from '../types/configuration';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthInitialized: boolean;
  savedConfigurations: SavedConfiguration[];
  authModalOpen: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthInitialized: (initialized: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  saveConfiguration: (config: Omit<SavedConfiguration, 'id' | 'createdAt'>) => SavedConfiguration;
  removeSavedConfiguration: (id: string) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'apexgolf_auth_user';

// Synchronous session recovery from localStorage to prevent logout on page refresh
const getInitialUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn('Failed to parse cached auth user:', err);
    return null;
  }
};

const initialSavedConfigs: SavedConfiguration[] = [
  {
    id: 'cfg_101',
    userId: 'usr_demo_88',
    productId: 'apex-tour-pro-01',
    productName: 'Apex Tour Pro Staff Bag',
    name: 'Tournament Stealth Red',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    configuration: {
      bag_main_body: { color: '#111827', roughness: 0.4 },
      bag_front_pocket: { color: '#b91c1c', roughness: 0.5 },
      bag_strap: { color: '#1e293b', roughness: 0.6 }
    }
  },
  {
    id: 'cfg_102',
    userId: 'usr_demo_88',
    productId: 'apex-tour-pro-01',
    productName: 'Apex Tour Pro Staff Bag',
    name: 'Augusta Gold Crest',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    configuration: {
      bag_main_body: { color: '#047857', roughness: 0.4 },
      bag_front_pocket: { color: '#f8fafc', roughness: 0.5 },
      bag_logo: { color: '#f59e0b', roughness: 0.15, metalness: 0.95 }
    }
  }
];

const cachedUser = getInitialUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: cachedUser,
  isAuthenticated: !!cachedUser,
  isLoading: !cachedUser,
  isAuthInitialized: !!cachedUser,
  savedConfigurations: initialSavedConfigs,
  authModalOpen: false,

  setUser: (user) => {
    if (user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {}
    }
    set({ user, isAuthenticated: !!user, isLoading: false, isAuthInitialized: true });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setAuthInitialized: (isAuthInitialized) => set({ isAuthInitialized }),
  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),

  saveConfiguration: (configData) => {
    const newConfig: SavedConfiguration = {
      ...configData,
      id: `cfg_${Date.now()}`,
      userId: get().user?.uid || 'guest',
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      savedConfigurations: [newConfig, ...state.savedConfigurations]
    }));

    return newConfig;
  },

  removeSavedConfiguration: (id) => {
    set((state) => ({
      savedConfigurations: state.savedConfigurations.filter((c) => c.id !== id)
    }));
  },

  logout: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
    set({ user: null, isAuthenticated: false, isLoading: false, isAuthInitialized: true });
  }
}));
