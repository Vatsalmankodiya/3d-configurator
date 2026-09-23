import { ProductConfiguration } from './configuration';

export interface CustomizationPart {
  id: string;
  name: string;
  meshName: string;
  defaultColor: string;
  defaultRoughness: number;
  defaultMetalness?: number;
  customizable: boolean;
  category?: 'body' | 'pockets' | 'straps' | 'details' | 'hardware';
  cameraAngle?: 'front' | 'back' | 'left' | 'right' | 'top' | 'strap';
}

export interface ProductCustomizationDef {
  enabled: boolean;
  parts: CustomizationPart[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  thumbnailUrl: string;
  imageUrl?: string;
  modelUrl: string;
  category: string;
  createdAt?: string;
  createdBy?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  customization: ProductCustomizationDef;
  features: string[];
  specs: {
    divider: string;
    weight: string;
    pockets: string;
    material: string;
  };
}
