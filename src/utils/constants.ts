import { Product } from '../types/product';
import { ColorPreset, PresetTheme } from '../types/configuration';

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'black', name: 'Stealth Black', hex: '#111827' },
  { id: 'white', name: 'Pearl White', hex: '#f8fafc', border: '#cbd5e1' },
  { id: 'navy', name: 'Royal Navy', hex: '#1e3a8a' },
  { id: 'red', name: 'Crimson Red', hex: '#b91c1c' },
  { id: 'green', name: 'Augusta Green', hex: '#047857' },
  { id: 'grey', name: 'Charcoal Grey', hex: '#4b5563' },
  { id: 'brown', name: 'Heritage Brown', hex: '#78350f' },
  { id: 'gold', name: 'Champagne Gold', hex: '#d97706' },
  { id: 'teal', name: 'Pacific Teal', hex: '#0f766e' },
  { id: 'burgundy', name: 'Deep Burgundy', hex: '#831843' },
];

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'stealth',
    name: 'Stealth Matte Black',
    description: 'Ultra-sleek monochrome dark edition with brushed metal accents.',
    previewColors: ['#111827', '#1f2937', '#374151', '#d1d5db'],
    configuration: {
      bag_main_body: { color: '#111827', roughness: 0.45 },
      bag_top: { color: '#1f2937', roughness: 0.3 },
      bag_bottom: { color: '#0f172a', roughness: 0.7 },
      bag_front_pocket: { color: '#111827', roughness: 0.5 },
      bag_left_pocket: { color: '#1f2937', roughness: 0.5 },
      bag_right_pocket: { color: '#1f2937', roughness: 0.5 },
      bag_strap: { color: '#1e293b', roughness: 0.65 },
      bag_handle: { color: '#020617', roughness: 0.4 },
      bag_zipper: { color: '#334155', roughness: 0.3, metalness: 0.8 },
      bag_metal_parts: { color: '#94a3b8', roughness: 0.2, metalness: 0.9 },
      bag_logo: { color: '#d97706', roughness: 0.2, metalness: 0.95 },
    }
  },
  {
    id: 'masters',
    name: 'Augusta Masters Edition',
    description: 'Iconic forest green & pearl white with gold championship hardware.',
    previewColors: ['#047857', '#f8fafc', '#d97706', '#111827'],
    configuration: {
      bag_main_body: { color: '#047857', roughness: 0.4 },
      bag_top: { color: '#111827', roughness: 0.3 },
      bag_bottom: { color: '#064e3b', roughness: 0.7 },
      bag_front_pocket: { color: '#f8fafc', roughness: 0.5 },
      bag_left_pocket: { color: '#047857', roughness: 0.5 },
      bag_right_pocket: { color: '#047857', roughness: 0.5 },
      bag_strap: { color: '#047857', roughness: 0.6 },
      bag_handle: { color: '#111827', roughness: 0.4 },
      bag_zipper: { color: '#d97706', roughness: 0.3, metalness: 0.85 },
      bag_metal_parts: { color: '#f59e0b', roughness: 0.15, metalness: 0.95 },
      bag_logo: { color: '#f59e0b', roughness: 0.15, metalness: 0.95 },
    }
  },
  {
    id: 'heritage',
    name: 'Heritage Leather & Cream',
    description: 'Classic luxury golf aesthetic with rich saddle brown leather aesthetics.',
    previewColors: ['#78350f', '#f8fafc', '#d97706', '#111827'],
    configuration: {
      bag_main_body: { color: '#78350f', roughness: 0.6 },
      bag_top: { color: '#451a03', roughness: 0.4 },
      bag_bottom: { color: '#292524', roughness: 0.8 },
      bag_front_pocket: { color: '#f8fafc', roughness: 0.5 },
      bag_left_pocket: { color: '#78350f', roughness: 0.6 },
      bag_right_pocket: { color: '#78350f', roughness: 0.6 },
      bag_strap: { color: '#78350f', roughness: 0.65 },
      bag_handle: { color: '#451a03', roughness: 0.4 },
      bag_zipper: { color: '#b45309', roughness: 0.3, metalness: 0.8 },
      bag_metal_parts: { color: '#f59e0b', roughness: 0.2, metalness: 0.9 },
      bag_logo: { color: '#f59e0b', roughness: 0.15, metalness: 0.95 },
    }
  },
  {
    id: 'crimson_navy',
    name: 'Royal Crimson & Navy',
    description: 'High performance sports styling with vibrant crimson accent pockets.',
    previewColors: ['#1e3a8a', '#b91c1c', '#f8fafc', '#94a3b8'],
    configuration: {
      bag_main_body: { color: '#1e3a8a', roughness: 0.4 },
      bag_top: { color: '#1e293b', roughness: 0.3 },
      bag_bottom: { color: '#0f172a', roughness: 0.7 },
      bag_front_pocket: { color: '#b91c1c', roughness: 0.5 },
      bag_left_pocket: { color: '#1e3a8a', roughness: 0.5 },
      bag_right_pocket: { color: '#1e3a8a', roughness: 0.5 },
      bag_strap: { color: '#b91c1c', roughness: 0.6 },
      bag_handle: { color: '#1e293b', roughness: 0.4 },
      bag_zipper: { color: '#cbd5e1', roughness: 0.2, metalness: 0.9 },
      bag_metal_parts: { color: '#cbd5e1', roughness: 0.15, metalness: 0.95 },
      bag_logo: { color: '#f8fafc', roughness: 0.2, metalness: 0.8 },
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'apex-tour-pro-01',
    name: 'Apex Tour Pro Staff Bag',
    tagline: 'The Pinnacle of Bespoke Golf Craftsmanship',
    description: 'Designed for tour professionals and discerning players. Ultra-durable weather-resistant PBR synthetic fabric with 14-way velvet dividers and magnetic accessory pockets.',
    price: 349,
    rating: 4.9,
    reviewsCount: 128,
    thumbnailUrl: '/images/products/tour-pro-thumb.jpg',
    modelUrl: '/models/golf-bag.glb',
    category: 'Staff Bags',
    isBestseller: true,
    features: [
      '14-Way Full Length Divider Top',
      'Dual Magnetic Velvet-Lined Rangefinder Pockets',
      'Waterproof Sealed Zipper Construction',
      'Ergonomic Dual Padded Shoulder Strap System',
      'Ultra-Lightweight Molded Rubber Base Baseplate'
    ],
    specs: {
      divider: '14-Way Velvet Top',
      weight: '5.2 lbs / 2.3 kg',
      pockets: '9 Seam-Sealed Pockets',
      material: 'PBR Poly-Synthetic Leather'
    },
    customization: {
      enabled: true,
      parts: [
        {
          id: 'bag_main_body',
          name: 'Main Body Chassis',
          meshName: 'bag_main_body',
          defaultColor: '#111827',
          defaultRoughness: 0.45,
          customizable: true,
          category: 'body',
          cameraAngle: 'front'
        },
        {
          id: 'bag_front_pocket',
          name: 'Front Ball Pocket',
          meshName: 'bag_front_pocket',
          defaultColor: '#b91c1c',
          defaultRoughness: 0.5,
          customizable: true,
          category: 'pockets',
          cameraAngle: 'front'
        },
        {
          id: 'bag_left_pocket',
          name: 'Left Garment Pocket',
          meshName: 'bag_left_pocket',
          defaultColor: '#111827',
          defaultRoughness: 0.5,
          customizable: true,
          category: 'pockets',
          cameraAngle: 'left'
        },
        {
          id: 'bag_right_pocket',
          name: 'Right Accessory Pocket',
          meshName: 'bag_right_pocket',
          defaultColor: '#111827',
          defaultRoughness: 0.5,
          customizable: true,
          category: 'pockets',
          cameraAngle: 'right'
        },
        {
          id: 'bag_strap',
          name: 'Shoulder Harness Strap',
          meshName: 'bag_strap',
          defaultColor: '#1e293b',
          defaultRoughness: 0.65,
          customizable: true,
          category: 'straps',
          cameraAngle: 'strap'
        },
        {
          id: 'bag_top',
          name: 'Top Divider Cuff',
          meshName: 'bag_top',
          defaultColor: '#1f2937',
          defaultRoughness: 0.3,
          customizable: true,
          category: 'details',
          cameraAngle: 'top'
        },
        {
          id: 'bag_bottom',
          name: 'Reinforced Rubber Base',
          meshName: 'bag_bottom',
          defaultColor: '#0f172a',
          defaultRoughness: 0.7,
          customizable: true,
          category: 'details',
          cameraAngle: 'front'
        },
        {
          id: 'bag_handle',
          name: 'Top Grab Handle',
          meshName: 'bag_handle',
          defaultColor: '#020617',
          defaultRoughness: 0.4,
          customizable: true,
          category: 'details',
          cameraAngle: 'top'
        },
        {
          id: 'bag_zipper',
          name: 'Zipper Seams & Trims',
          meshName: 'bag_zipper',
          defaultColor: '#334155',
          defaultRoughness: 0.3,
          defaultMetalness: 0.8,
          customizable: true,
          category: 'hardware',
          cameraAngle: 'front'
        },
        {
          id: 'bag_metal_parts',
          name: 'Metal Buckles & Rings',
          meshName: 'bag_metal_parts',
          defaultColor: '#94a3b8',
          defaultRoughness: 0.15,
          defaultMetalness: 0.9,
          customizable: true,
          category: 'hardware',
          cameraAngle: 'strap'
        },
        {
          id: 'bag_logo',
          name: 'Embossed Logo Crest',
          meshName: 'bag_logo',
          defaultColor: '#d97706',
          defaultRoughness: 0.2,
          defaultMetalness: 0.95,
          customizable: true,
          category: 'hardware',
          cameraAngle: 'front'
        }
      ]
    }
  },
  {
    id: 'apex-hybrid-stand-02',
    name: 'Apex Ultralight Stand Bag',
    tagline: 'Versatile Featherweight Stand Bag',
    description: 'Engineered with carbon fiber leg stands and quick-deploy mechanism. Designed for walking 18 holes in total comfort.',
    price: 279,
    rating: 4.8,
    reviewsCount: 84,
    thumbnailUrl: '/images/products/stand-bag-thumb.jpg',
    modelUrl: '/models/golf-bag.glb',
    category: 'Stand Bags',
    isNew: true,
    features: [
      'Carbon Fiber Quick-Deploy Stand Legs',
      'Self-Balancing 4-Point Shoulder Strap',
      'Insulated Cooler Bottle Pocket',
      'Seam-Sealed Rainhood Included'
    ],
    specs: {
      divider: '6-Way Way Top',
      weight: '3.8 lbs / 1.7 kg',
      pockets: '7 Pockets',
      material: 'Ultra-Light Ripstop Poly'
    },
    customization: {
      enabled: true,
      parts: [
        {
          id: 'bag_main_body',
          name: 'Main Body Chassis',
          meshName: 'bag_main_body',
          defaultColor: '#1e3a8a',
          defaultRoughness: 0.4,
          customizable: true,
          category: 'body',
          cameraAngle: 'front'
        },
        {
          id: 'bag_front_pocket',
          name: 'Front Ball Pocket',
          meshName: 'bag_front_pocket',
          defaultColor: '#f8fafc',
          defaultRoughness: 0.5,
          customizable: true,
          category: 'pockets',
          cameraAngle: 'front'
        },
        {
          id: 'bag_strap',
          name: 'Shoulder Strap',
          meshName: 'bag_strap',
          defaultColor: '#1e3a8a',
          defaultRoughness: 0.6,
          customizable: true,
          category: 'straps',
          cameraAngle: 'strap'
        }
      ]
    }
  }
];
