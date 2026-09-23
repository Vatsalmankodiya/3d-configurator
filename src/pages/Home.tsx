import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { fetchProductsFromFirestore } from '../firebase/products';
import { Box, Sparkles, Shield, ArrowRight, CheckCircle2, Star, Award, ImageOff } from 'lucide-react';

interface HomeProps {
  setActiveTab?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useProductStore();

  // Fetch products for the featured section
  useEffect(() => {
    if (products.length === 0) {
      fetchProductsFromFirestore()
        .then((prods) => setProducts(prods))
        .catch(() => {});
    }
  }, [products.length, setProducts]);

  return (
    <div className="space-y-20 py-6 animate-fadeIn">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-8 lg:p-16 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 rounded-full bg-red-900/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="badge badge-red">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              World's Premier 3D Golf Configurator
            </span>

            <h1 className="text-4xl lg:text-6xl font-black tracking-tight font-heading leading-tight">
              Design Your{' '}
              <span className="text-red-500">Bespoke</span>{' '}
              Tour Golf Bag in 3D
            </h1>

            <p className="text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Experience real-time WebGL customization. Tailor individual body panels, pockets, straps,
              handles, and hardware with instant visual feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/products')}
                className="btn-primary w-full sm:w-auto text-base py-4 px-8 shadow-xl shadow-red-600/30"
              >
                <Box className="w-5 h-5" />
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto text-base py-4 px-8 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white font-heading">100%</p>
                <p className="text-xs text-slate-400 font-semibold">Real-Time 3D</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white font-heading">Live</p>
                <p className="text-xs text-slate-400 font-semibold">Parts Select</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white font-heading">GLB</p>
                <p className="text-xs text-slate-400 font-semibold">3D Format</p>
              </div>
            </div>
          </div>

          {/* Hero Feature Card Right */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                  <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mx-auto">
                    <Box className="w-10 h-10 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">Interactive 3D Studio</h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time model viewer & customizer</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                {[
                  '360° Model Rotation',
                  'Per-Part Color Editor',
                  'Fullscreen Mode',
                  'Firebase Storage',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/products')}
                className="btn-primary w-full text-xs py-3"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge badge-red">Intuitive Process</span>
          <h2 className="text-3xl font-bold text-slate-900 font-heading">
            How 3D Customization Works
          </h2>
          <p className="text-sm text-slate-500">
            From product catalog to personalized 3D view — four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { step: 1, title: 'Browse Products', desc: 'Explore our catalog and find the product that interests you.' },
            { step: 2, title: 'Open Product', desc: 'Click any product to view its full details, image and description.' },
            { step: 3, title: 'Launch 3D Viewer', desc: 'Click "View in 3D" to open the interactive model loaded from our server.' },
            { step: 4, title: 'Select & Customize', desc: 'Select model parts and apply your preferred colors in real time.' },
          ].map((item) => (
            <div key={item.step} className="glass-card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black font-heading text-lg shadow-md shadow-red-600/25">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      {products.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 font-heading">Featured Products</h2>
              <p className="text-xs text-slate-500 mt-1">Select a product to explore it in 3D</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                      <ImageOff className="w-8 h-8" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  {product.modelUrl && (
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-emerald text-[10px]">3D View</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-lg font-black text-red-600 font-heading">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-red-600 px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      View Product
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Trust / Testimonials */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-10 text-white space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge badge-gold">Professional Endorsements</span>
          <h2 className="text-3xl font-bold text-white font-heading">
            Trusted by Professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {[
            { quote: '"Being able to see my bag in 3D and customize the leather panels before ordering was incredible. The physical bag matched the 3D model perfectly!"', author: 'Marcus Thorne, PGA Tour Competitor' },
            { quote: '"The roughness slider is super realistic. I wanted a semi-matte front pocket with glossy main body leather — Apex delivered exactly what I envisioned."', author: 'David Sterling, Golf Digest Reviewer' },
            { quote: '"Fast, smooth, and no bulky 3D software feel. ApexGolf has set a new standard for luxury custom golf equipment online."', author: 'Harrison Vance, Club Champion' },
          ].map((t, i) => (
            <div key={i} className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 italic leading-relaxed">{t.quote}</p>
              <p className="font-bold text-white font-heading">— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
