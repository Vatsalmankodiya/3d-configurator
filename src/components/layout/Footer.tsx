import React from 'react';
import { Box, Shield, Truck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 text-slate-600 text-xs shadow-sm">
      {/* Service Value Highlights */}
      <div className="border-b border-slate-100 py-8">
        <div className="content-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Real-Time 3D Studio</p>
              <p className="text-[11px] text-slate-500">Live WebGL material customizer</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Complimentary Shipping</p>
              <p className="text-[11px] text-slate-500">Global insured express delivery</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Handcrafted Precision</p>
              <p className="text-[11px] text-slate-500">PBR Tour-Grade Materials</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Lifetime Warranty</p>
              <p className="text-[11px] text-slate-500">100% Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="content-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-slate-900 text-base">
            APEX<span className="text-red-600">GOLF</span>
          </span>
          <span className="text-slate-300">|</span>
          <span>© {new Date().getFullYear()} ApexGolf Inc. All rights reserved.</span>
        </div>

        <div className="flex gap-6 text-slate-500 font-medium">
          <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-red-600 transition-colors">Firebase Architecture</a>
          <a href="#" className="hover:text-red-600 transition-colors">3D Model Guidelines</a>
        </div>
      </div>
    </footer>
  );
};
