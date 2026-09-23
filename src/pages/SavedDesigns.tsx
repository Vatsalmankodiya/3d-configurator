import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useConfiguratorStore } from '../store/configuratorStore';
import { Bookmark, Box, Trash2, ArrowRight, Layers } from 'lucide-react';

interface SavedDesignsProps {
  setActiveTab: (tab: 'home' | 'products' | 'configurator' | 'saved' | 'cart' | 'admin') => void;
}

export const SavedDesigns: React.FC<SavedDesignsProps> = ({ setActiveTab }) => {
  const { savedConfigurations, removeSavedConfiguration } = useAuthStore();
  const { loadConfiguration } = useConfiguratorStore();

  const handleOpenInStudio = (saved: any) => {
    loadConfiguration(saved.configuration);
    setActiveTab('configurator');
  };

  if (savedConfigurations.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 py-12 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-lg">
          <Bookmark className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">No Saved Designs Yet</h2>
          <p className="text-xs text-slate-500">
            Bookmark your favorite 3D golf bag configurations while customizing to re-edit or purchase later.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('configurator')}
          className="btn-primary text-sm py-3 px-6"
        >
          <Box className="w-4 h-4" />
          <span>Launch 3D Configurator</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Saved 3D Locker</h1>
          <p className="text-xs text-slate-500">Manage and reload your saved bespoke golf bag configurations</p>
        </div>
        <span className="badge badge-red">{savedConfigurations.length} Saved Designs</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedConfigurations.map((saved) => {
          const configParts = Object.entries(saved.configuration);
          return (
            <div key={saved.id} className="glass-card p-6 space-y-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm bg-white">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">{saved.name}</h3>
                    <p className="text-xs text-red-600 font-bold">{saved.productName}</p>
                  </div>
                  <button
                    onClick={() => removeSavedConfiguration(saved.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete saved configuration"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Configuration Color Swatch Pills */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-red-600" />
                    Custom Material Configuration:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {configParts.map(([partId, partConfig]) => (
                      <span
                        key={partId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono shadow-2xs font-medium"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: partConfig.color }}
                        />
                        <span className="capitalize">{partId.replace('bag_', '').replace('_', ' ')}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  Saved: {new Date(saved.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleOpenInStudio(saved)}
                  className="btn-primary text-xs py-2 px-4"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Open in 3D Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
