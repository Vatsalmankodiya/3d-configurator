import React from 'react';
import { Box, Shield, Zap, Users, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-10 lg:p-16 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-red-800/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="badge badge-red mb-5">
            <Award className="w-3.5 h-3.5" />
            About Us
          </span>
          <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight mb-5">
            Bringing Products to Life{' '}
            <span className="text-red-500">in 3D</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
            We are a premium product configurator platform that enables brands to
            showcase their products in interactive 3D. Customers can explore every
            detail, customize colors and materials, and experience products before
            they order.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge badge-red mb-3">Our Mission</span>
          <h2 className="text-3xl font-bold text-slate-900 font-heading">
            Why We Build in 3D
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Traditional product photos don't tell the full story. We believe every
            customer deserves to truly experience a product before committing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Box,
              color: 'text-red-600',
              bg: 'bg-red-50 border-red-100',
              title: 'Real-Time 3D',
              desc: 'WebGL-powered 3D viewers that run directly in your browser. No plugins, no downloads — just instant, fluid interaction.',
            },
            {
              icon: Zap,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-100',
              title: 'Instant Customization',
              desc: 'Select any part of a product model and change its color in real time. What you see is exactly what gets produced.',
            },
            {
              icon: Shield,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-100',
              title: 'Secure & Reliable',
              desc: 'Built on Firebase with enterprise-grade security. Your data is safe, your sessions are persistent, and access is role-based.',
            },
          ].map((item) => (
            <div key={item.title} className="glass-card p-7 space-y-4 rounded-2xl">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="glass-panel p-10 bg-slate-50 border-slate-200 space-y-8 rounded-3xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge badge-slate mb-3">The Process</span>
          <h2 className="text-3xl font-bold text-slate-900 font-heading">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Admin Adds Product', desc: 'Admin uploads product image, 3D model file, name and pricing.' },
            { step: 2, title: 'Product Goes Live', desc: 'Product instantly appears in the catalog, ready for users.' },
            { step: 3, title: 'User Explores in 3D', desc: 'User opens the product, rotates, zooms and inspects the model.' },
            { step: 4, title: 'User Customizes', desc: 'User selects model parts and applies colors in real time.' },
          ].map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black font-heading text-base shadow-md shadow-red-600/25">
                {item.step}
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / CTA */}
      <section className="flex flex-col md:flex-row items-center gap-8 p-8 lg:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex-1 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Ready to Explore?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            Browse our product catalog and experience your first interactive 3D view today. 
            Each product is exactly as the manufacturer designed it — no compromises.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary text-sm py-3.5 px-7 mt-2"
          >
            <span>View Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex flex-col gap-4 shrink-0">
          {[
            { label: 'Interactive 3D', value: '100%', color: 'text-red-600' },
            { label: 'Real-Time Updates', value: 'Live', color: 'text-emerald-600' },
            { label: 'Secure Auth', value: 'Firebase', color: 'text-blue-600' },
          ].map((stat) => (
            <div key={stat.label} className="text-right">
              <p className={`text-2xl font-black font-heading ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-400 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
