import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { useAuthStore } from '../../store/authStore';
import { X, BookmarkCheck, Sparkles, Check } from 'lucide-react';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveDesignModal: React.FC<SaveDesignModalProps> = ({ isOpen, onClose }) => {
  const { currentProduct, configuration } = useConfiguratorStore();
  const { saveConfiguration } = useAuthStore();
  const [designName, setDesignName] = useState('My Custom Apex Tour Bag');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfiguration({
      productId: currentProduct.id,
      productName: currentProduct.name,
      name: designName,
      configuration: JSON.parse(JSON.stringify(configuration))
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Save Custom 3D Configuration</h3>
            <p className="text-xs text-slate-500">Store design in your personal locker to re-edit anytime.</p>
          </div>
        </div>

        {isSaved ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-scaleUp">
            <Check className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-sm font-semibold text-emerald-800">Configuration Saved Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Design Title
              </label>
              <input
                type="text"
                required
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="e.g. Tournament Stealth Edition"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:border-red-600 outline-none transition-colors font-medium"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                Product: {currentProduct.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {Object.keys(configuration).length} Customized Parts JSON bound
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Save Design
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
