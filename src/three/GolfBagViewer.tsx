import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GolfBagModel } from './GolfBagModel';
import { ProceduralGolfBag } from './ProceduralGolfBag';
import { SceneLighting } from './SceneLighting';
import { CameraControls } from './CameraControls';
import { useConfiguratorStore } from '../store/configuratorStore';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GolfBagViewerProps {
  modelUrl?: string;
}

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('GLTF Loader error caught, switching to procedural fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const GolfBagViewer: React.FC<GolfBagViewerProps> = ({ modelUrl = '/models/golf-bag.glb' }) => {
  const { currentProduct, missingMeshes } = useConfiguratorStore();
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[580px] bg-gradient-to-b from-slate-50 via-white to-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 flex flex-col justify-center items-center select-none">
      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.1, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#f8fafc']} />
        
        <SceneLighting />
        
        <Suspense fallback={null}>
          {!useFallback ? (
            <ModelErrorBoundary fallback={<ProceduralGolfBag />}>
              <GolfBagModel modelUrl={modelUrl || currentProduct.modelUrl} />
            </ModelErrorBoundary>
          ) : (
            <ProceduralGolfBag />
          )}
        </Suspense>

        {/* Soft Ground Shadow Plane */}
        <mesh position={[0, -0.66, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.12} />
        </mesh>

        <CameraControls />
      </Canvas>

      {/* Dev Warning Badge if Firestore mesh was missing */}
      {missingMeshes.length > 0 && (
        <div className="absolute top-4 left-4 right-4 z-20 max-w-md bg-amber-500/10 backdrop-blur-md text-amber-900 text-xs p-3 rounded-xl border border-amber-300/60 flex items-start gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Model Configuration Warning</p>
            <p className="mt-0.5 text-amber-800/80">
              Mesh non-exact match: {missingMeshes.join(', ')}. (Active procedural rendering fallback enabled).
            </p>
          </div>
        </div>
      )}

      {/* Fallback Toggle Switch */}
      <button
        onClick={() => setUseFallback(!useFallback)}
        className="absolute bottom-4 left-4 z-20 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 flex items-center gap-1.5 transition-all shadow-sm"
        title="Toggle between GLB file and procedural mesh engine"
      >
        <RefreshCw className="w-3 h-3 text-red-600" />
        <span>Engine: {useFallback ? 'Procedural Engine' : 'Production GLB'}</span>
      </button>

      {/* Interactive Helper Overlay Hint */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-[11px] text-slate-600 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 flex items-center gap-2 shadow-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        <span>Drag to rotate • Scroll/Pinch to zoom • Click part to select</span>
      </div>
    </div>
  );
};
