import React from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { COLOR_PRESETS } from '../../utils/constants';
import { Palette, Check, Pipette } from 'lucide-react';

export const ColorSwatchPicker: React.FC = () => {
  const { currentProduct, selectedPartId, configuration, setPartColor } = useConfiguratorStore();

  const selectedPart = currentProduct.customization.parts.find((p) => p.id === selectedPartId);
  const activeColor = configuration[selectedPartId]?.color || selectedPart?.defaultColor || '#111827';

  // Find color preset name if available
  const presetMatch = COLOR_PRESETS.find(p => p.hex.toLowerCase() === activeColor.toLowerCase());
  const activeColorName = presetMatch ? presetMatch.name : activeColor;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-rose-600" />
          2. Select Color ({selectedPart?.name || 'Selected Part'})
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 font-heading">
            {activeColorName}
          </span>
          <span
            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
            style={{ backgroundColor: activeColor }}
          />
        </div>
      </div>

      {/* Color Swatch Grid */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {COLOR_PRESETS.map((preset) => {
          const isSelected = activeColor.toLowerCase() === preset.hex.toLowerCase();
          return (
            <button
              key={preset.id}
              onClick={() => setPartColor(selectedPartId, preset.hex)}
              title={`${preset.name} (${preset.hex})`}
              className={`relative h-9 rounded-xl transition-all flex items-center justify-center border shadow-xs ${
                isSelected
                  ? 'scale-110 border-rose-600 ring-2 ring-rose-500/30 z-10'
                  : 'border-slate-200 hover:scale-105 hover:border-slate-400'
              }`}
              style={{ backgroundColor: preset.hex }}
            >
              {isSelected && (
                <Check
                  className={`w-4 h-4 stroke-[3] ${
                    preset.hex === '#f8fafc' || preset.hex === '#ffffff' || preset.hex === '#cbd5e1'
                      ? 'text-slate-900'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Color Input */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Pipette className="w-3.5 h-3.5 text-slate-500" />
          Custom Color Code:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={activeColor}
            onChange={(e) => setPartColor(selectedPartId, e.target.value)}
            className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
          />
          <input
            type="text"
            value={activeColor}
            onChange={(e) => setPartColor(selectedPartId, e.target.value)}
            className="w-20 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 font-mono text-center uppercase focus:border-rose-600 outline-none font-bold"
          />
        </div>
      </div>
    </div>
  );
};
