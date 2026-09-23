import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useCartStore } from '../../store/cartStore';
import { PartSelector } from './PartSelector';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import { RoughnessControl } from './RoughnessControl';
import { PresetThemesBar } from './PresetThemesBar';
import { SaveDesignModal } from './SaveDesignModal';
import { ShoppingBag, RotateCcw, Bookmark, Check, Star, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomizationPanel: React.FC = () => {
  const { currentProduct, configuration, resetConfiguration } = useConfiguratorStore();
  const { addItem } = useCartStore();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const customizedPartsCount = Object.keys(configuration).length;

  const handleAddToCart = () => {
    addItem(
      {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        thumbnailUrl: currentProduct.thumbnailUrl
      },
      configuration
    );

    setAddedAnimation(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.85 }
    });

    setTimeout(() => {
      setAddedAnimation(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/90 p-5 lg:p-6 space-y-6 shadow-xl">
      {/* Product Title & Rating Header */}
      <div className="space-y-2.5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="badge badge-red">
            <Sparkles className="w-3 h-3 text-rose-600" />
            3D Bespoke Configurator
          </span>
          <span className="text-2xl font-black text-rose-600 font-heading">
            ${currentProduct.price}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">
          {currentProduct.name}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {currentProduct.description}
        </p>

        {/* Rating & Guarantee */}
        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1 text-rose-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-rose-600" />
            <span>{currentProduct.rating}</span>
            <span className="text-slate-400 font-normal">({currentProduct.reviewsCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PGA Tour Warranty</span>
          </div>
        </div>
      </div>

      {/* Interactive Customization Controls */}
      <div className="space-y-6 flex-1 overflow-y-auto pr-1 scrollbar-none">
        <PartSelector />
        <ColorSwatchPicker />
        <RoughnessControl />
        <PresetThemesBar />
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-3 shrink-0">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={resetConfiguration}
            className="btn-secondary text-xs py-2.5"
            title="Revert all materials to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Design
          </button>

          <button
            onClick={() => setSaveModalOpen(true)}
            className="btn-secondary text-xs py-2.5"
            title="Save 3D configuration to design locker"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-600" />
            Save Design
          </button>
        </div>

        {/* Add To Cart CTA Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
            addedAnimation
              ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-[0.99]'
              : 'btn-primary'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-5 h-5 animate-bounce" />
              <span>Configuration Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add Custom Golf Bag to Cart — ${currentProduct.price}</span>
            </>
          )}
        </button>
      </div>

      {/* Save Design Modal */}
      <SaveDesignModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} />
    </div>
  );
};
