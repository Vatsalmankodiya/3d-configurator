import React from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const RoughnessControl: React.FC = () => {
  const { currentProduct, selectedPartId, configuration, setPartRoughness, setPartMetalness } = useConfiguratorStore();

  const selectedPart = currentProduct.customization.parts.find((p) => p.id === selectedPartId);
  const partConfig = configuration[selectedPartId] || { roughness: 0.5, metalness: 0.1 };
  const roughness = partConfig.roughness ?? 0.5;
  const metalness = partConfig.metalness ?? 0.1;

  const getRoughnessLabel = (val: number) => {
    if (val < 0.2) return 'Ultra Glossy & Reflective';
    if (val < 0.4) return 'Satin / Smooth Finish';
    if (val < 0.65) return 'Standard PBR Leather Grain';
    if (val < 0.85) return 'Textured Matte Canvas';
    return 'Heavy Tactical Matte';
  };

  return (
    <div className="space-y-4 pt-1 border-t border-slate-200/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
          3. Surface Texture & Roughness
        </label>
        <span className="text-xs font-semibold text-red-600">
          {(roughness * 100).toFixed(0)}% ({getRoughnessLabel(roughness)})
        </span>
      </div>

      {/* Roughness Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.02"
          value={roughness}
          onChange={(e) => setPartRoughness(selectedPartId, parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider font-mono font-medium">
          <span>0.0 Glossy</span>
          <span>0.5 Semi-Matte</span>
          <span>1.0 Rough</span>
        </div>
      </div>

      {/* Metalness Slider */}
      {(selectedPart?.category === 'hardware' || selectedPart?.id.includes('metal') || selectedPart?.id.includes('logo') || selectedPart?.id.includes('zipper')) && (
        <div className="space-y-2 pt-2 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              Metallic Hardware Polish
            </label>
            <span className="text-xs font-mono font-bold text-slate-800">
              {(metalness * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={metalness}
            onChange={(e) => setPartMetalness(selectedPartId, parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>
      )}
    </div>
  );
};
