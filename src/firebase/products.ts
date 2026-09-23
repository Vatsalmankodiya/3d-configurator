import { db } from './config';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types/product';
import { INITIAL_PRODUCTS } from '../utils/constants';

export interface NewProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl: string;
  createdBy?: string;
}

/**
 * Fetch all products ONLY from Firestore DB 'products' collection.
 * NO localStorage cache — Firebase is the single source of truth.
 * If a product is deleted from Firebase, it will not appear here.
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products: Product[] = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    products.push({
      id: docSnap.id,
      name: data.name || 'Untitled Product',
      description: data.description || '',
      price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
      imageUrl: data.imageUrl || data.thumbnailUrl || '',
      thumbnailUrl: data.imageUrl || data.thumbnailUrl || '',
      modelUrl: data.modelUrl || '',
      createdAt: data.createdAt
        ? data.createdAt.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt
        : new Date().toISOString(),
      createdBy: data.createdBy || 'admin',
      category: data.category || 'Custom 3D Bags',
      customization: data.customization || { enabled: true, parts: [] },
      tagline: data.tagline || data.name || '',
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 0,
      features: data.features || [],
      specs: data.specs || {
        divider: '14-Way',
        weight: '5.5 lbs',
        pockets: '9 Pockets',
        material: 'Synthetic Leather',
      },
    });
  });

  return products;
}

/**
 * Save new Admin-added product ONLY to Firestore DB.
 * Firebase is the source of truth. No localStorage cache.
 */
export async function addProductToFirestore(input: NewProductInput): Promise<Product> {
  const productId = `prod_${Date.now()}`;
  const defaultParts = INITIAL_PRODUCTS[0]?.customization.parts || [];

  const newProduct: Product = {
    id: productId,
    name: input.name,
    description: input.description || '',
    price: Number(input.price),
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    modelUrl: input.modelUrl,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy || 'admin',
    category: 'Custom 3D Bags',
    tagline: input.name,
    rating: 5.0,
    reviewsCount: 0,
    customization: { enabled: true, parts: defaultParts },
    features: [
      '14-Way Velvet Divider Top',
      'Waterproof Sealed Zipper Construction',
      'Dual Velvet-Lined Valuables Pockets',
      'Ergonomic Padded Dual Shoulder Harness System',
    ],
    specs: {
      divider: '14-Way Top',
      weight: '5.2 lbs',
      pockets: '8 Pockets',
      material: 'Synthetic PBR Leather',
    },
  };

  // Save ONLY to Firestore — no localStorage
  const productRef = doc(db, 'products', productId);
  await setDoc(productRef, {
    name: input.name,
    description: newProduct.description,
    price: Number(input.price),
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    modelUrl: input.modelUrl,
    createdAt: serverTimestamp(),
    createdBy: input.createdBy || 'admin',
    category: 'Custom 3D Bags',
    tagline: input.name,
    rating: 5.0,
    reviewsCount: 0,
    customization: { enabled: true, parts: defaultParts },
    features: newProduct.features,
    specs: newProduct.specs,
  });

  return newProduct;
}

export async function fetchProducts(): Promise<Product[]> {
  return await fetchProductsFromFirestore();
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const productRef = doc(db, 'products', product.id);
  await setDoc(productRef, product, { merge: true });
}
