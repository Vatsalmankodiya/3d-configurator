import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { Layers, Shield, Sparkles, Box, Check } from 'lucide-react';

export const PartSelector: React.FC = () => {
  const { currentProduct, selectedPartId, selectPart } = useConfiguratorStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'body' | 'pockets' | 'straps' | 'hardware'>('all');
  
  const parts = currentProduct.customization.parts;

  const categories = [
    { id: 'all', label: 'All Parts' },
    { id: 'body', label: 'Chassis' },
    { id: 'pockets', label: 'Pockets' },
    { id: 'straps', label: 'Harness' },
    { id: 'hardware', label: 'Hardware' }
  ];

  const filteredParts = activeCategory === 'all' 
    ? parts 
    : parts.filter((p) => p.category === activeCategory || (activeCategory === 'body' && (p.id.includes('body') || p.id.includes('top') || p.id.includes('bottom'))));

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-rose-600" />
          1. Select Component to Customize
        </label>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {parts.length} Parts Defined
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center ${
              activeCategory === cat.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Parts Swiper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
        {filteredParts.map((part) => {
          const isSelected = selectedPartId === part.id;
          return (
            <button
              key={part.id}
              onClick={() => selectPart(part.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="truncate">{part.name}</span>
              {isSelected ? (
                <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
