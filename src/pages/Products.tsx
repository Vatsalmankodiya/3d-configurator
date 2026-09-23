import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { fetchProductsFromFirestore } from '../firebase/products';
import { Package, ArrowRight, Loader2, ImageOff } from 'lucide-react';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductsFromFirestore()
      .then((prods) => {
        setProducts(prods);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      });
  }, [setProducts]);

  return (
    <div className="py-10 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-2xl">
        <span className="badge badge-red mb-3">Our Collection</span>
        <h1 className="text-4xl font-black text-slate-900 font-heading leading-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Browse our premium collection. Each product can be viewed in interactive 3D and customized to your preference.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
            <Package className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm font-bold text-slate-800">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchProductsFromFirestore()
                .then((prods) => { setProducts(prods); setLoading(false); })
                .catch(() => { setError('Failed to load products. Please try again.'); setLoading(false); });
            }}
            className="btn-primary text-xs py-2.5 px-6"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-700">No products available.</p>
            <p className="text-sm text-slate-400 mt-1">
              Check back soon — new products will appear here once added.
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Product Image */}
              <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                {/* Fallback shown when no image or image fails */}
                <div
                  className="img-fallback absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400"
                  style={{ display: product.imageUrl ? 'none' : 'flex' }}
                >
                  <ImageOff className="w-10 h-10" />
                  <span className="text-xs font-medium">No image</span>
                </div>

                {/* 3D Badge */}
                {product.modelUrl && (
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-emerald text-[10px] py-1 px-2 shadow-sm">
                      3D View
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xl font-black text-red-600 font-heading">
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-red-600 transition-all shadow-sm"
                  >
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
