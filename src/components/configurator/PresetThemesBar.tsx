import React from 'react';
import { useConfiguratorStore } from '../../store/configuratorStore';
import { PRESET_THEMES } from '../../utils/constants';
import { Wand2 } from 'lucide-react';

export const PresetThemesBar: React.FC = () => {
  const { applyPresetTheme } = useConfiguratorStore();

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-red-600" />
          Quick Style Presets
        </label>
        <span className="text-[11px] text-slate-400 font-medium">
          Instant Master Themes
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESET_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => applyPresetTheme(theme)}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all text-left group shadow-sm"
          >
            {/* Color Swatch Pill Preview */}
            <div className="flex items-center gap-1 mb-2">
              {theme.previewColors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1">
              {theme.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
