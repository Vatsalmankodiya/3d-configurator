import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { fetchProductsFromFirestore } from '../firebase/products';
import { Product } from '../types/product';
import {
  ArrowLeft,
  Box,
  Loader2,
  ImageOff,
  AlertTriangle,
  Tag,
  Info,
} from 'lucide-react';

// Lazy-load the 3D viewer so it only loads when user requests it
const ProductModelViewer = lazy(() =>
  import('../three/ProductModelViewer').then((m) => ({ default: m.ProductModelViewer }))
);

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, setProducts } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Try local store first (instant)
    const fromStore = products.find((p) => p.id === id);
    if (fromStore) {
      setProduct(fromStore);
      setLoading(false);
      return;
    }

    // Fetch from Firestore
    setLoading(true);
    fetchProductsFromFirestore()
      .then((prods) => {
        setProducts(prods);
        const found = prods.find((p) => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setNotFound(true);
        setLoading(false);
      });
  }, [id, products, setProducts]);

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fadeIn">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading product...</p>
      </div>
    );
  }

  // ─── Not Found ───────────────────────────────────────────────────────────────

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 font-heading">Product Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">
            This product doesn't exist or has been removed.
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary text-sm py-3 px-7"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  // ─── Product Detail ──────────────────────────────────────────────────────────

  return (
    <div className="py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Product Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 aspect-square flex items-center justify-center shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.img-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className="img-fallback flex flex-col items-center gap-3 text-slate-400"
            style={{ display: product.imageUrl ? 'none' : 'flex' }}
          >
            <ImageOff className="w-16 h-16" />
            <span className="text-sm font-medium">No image available</span>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6 lg:py-2">
          {/* Category badge */}
          {product.category && (
            <span className="badge badge-red">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>
          )}

          {/* Name */}
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 font-heading leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-red-600 font-heading">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Info className="w-3.5 h-3.5" />
                Description
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* 3D View Button */}
          <div className="space-y-3">
            {!show3D ? (
              <button
                onClick={() => setShow3D(true)}
                className="btn-primary w-full sm:w-auto text-sm py-4 px-8 shadow-xl shadow-red-600/25"
                disabled={!product.modelUrl}
                title={product.modelUrl ? 'Launch 3D viewer' : '3D model not available for this product'}
              >
                <Box className="w-5 h-5" />
                <span>View in 3D</span>
              </button>
            ) : (
              <button
                onClick={() => setShow3D(false)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Hide 3D Viewer
              </button>
            )}

            {!product.modelUrl && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                3D model is not available for this product.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3D Viewer — lazy loaded, only shown when user clicks */}
      {show3D && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Interactive 3D Viewer
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Rotate, zoom and pan the model. Select a part to change its color.
          </p>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <span className="text-sm font-semibold text-slate-500">
                  Loading 3D model...
                </span>
              </div>
            }
          >
            <ProductModelViewer modelUrl={product.modelUrl || null} />
          </Suspense>
        </div>
      )}
    </div>
  );
};
