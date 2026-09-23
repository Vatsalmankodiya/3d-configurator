import React from 'react';
import { useConfiguratorStore, CameraPreset } from '../../store/configuratorStore';
import { RotateCcw, Play, Pause, Compass } from 'lucide-react';

export const CameraPresetBar: React.FC = () => {
  const { cameraPreset, setCameraPreset, autoRotate, toggleAutoRotate } = useConfiguratorStore();

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'default', label: 'Overview' },
    { id: 'front', label: 'Front' },
    { id: 'back', label: 'Back' },
    { id: 'left', label: 'Left Side' },
    { id: 'right', label: 'Right Side' },
    { id: 'top', label: 'Top Divider' },
    { id: 'strap', label: 'Strap View' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm">
      {/* Preset View Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider px-2 flex items-center gap-1 shrink-0">
          <Compass className="w-3.5 h-3.5 text-red-600" />
          Camera:
        </span>
        {presets.map((preset) => {
          const isActive = cameraPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setCameraPreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Action Controls: Auto Rotate & Reset View */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={toggleAutoRotate}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoRotate ? 'Rotating' : 'Auto Rotate'}</span>
        </button>

        <button
          onClick={() => setCameraPreset('default')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
};
