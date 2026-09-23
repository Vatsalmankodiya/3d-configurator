export interface PartConfiguration {
  color: string;
  roughness: number;
  metalness?: number;
  texture?: 'leather' | 'fabric' | 'matte' | 'carbon';
}

export interface ProductConfiguration {
  [partId: string]: PartConfiguration;
}

export interface SavedConfiguration {
  id: string;
  userId?: string;
  productId: string;
  productName: string;
  name: string;
  configuration: ProductConfiguration;
  createdAt: string;
  previewUrl?: string;
}

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  border?: string;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  configuration: ProductConfiguration;
  previewColors: string[];
}
