import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCcw, Loader2, AlertTriangle, Box } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ModelPart {
  id: string;
  name: string;
  mesh: THREE.Mesh;
}

// ─── Inner 3D scene: loads GLTF and manages parts ────────────────────────────

interface SceneProps {
  modelUrl: string;
  onPartsReady: (parts: ModelPart[]) => void;
  selectedPartId: string | null;
  partColors: Record<string, string>;
  resetTrigger: number;
}

const ModelScene: React.FC<SceneProps> = ({
  modelUrl,
  onPartsReady,
  selectedPartId,
  partColors,
  resetTrigger,
}) => {
  const gltf = useGLTF(modelUrl);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const originalColorsRef = useRef<Map<string, THREE.Color>>(new Map());
  const partsReadyRef = useRef(false);

  // Discover all meshes in the loaded model
  useEffect(() => {
    if (partsReadyRef.current) return;
    partsReadyRef.current = true;

    const meshMap = new Map<string, THREE.Mesh>();
    const originalColors = new Map<string, THREE.Color>();
    const discovered: ModelPart[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const partName = mesh.name || `Part_${discovered.length + 1}`;
        const partId = partName;

        // Clone materials so we don't mutate the original
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = (mesh.material as THREE.Material).clone();
          }
        }

        // Store original color
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const firstStd = mats.find((m): m is THREE.MeshStandardMaterial => m instanceof THREE.MeshStandardMaterial);
        if (firstStd) {
          originalColors.set(partId, firstStd.color.clone());
        } else {
          originalColors.set(partId, new THREE.Color(0x888888));
        }

        meshMap.set(partId, mesh);
        discovered.push({ id: partId, name: partName, mesh });
      }
    });

    meshMapRef.current = meshMap;
    originalColorsRef.current = originalColors;
    onPartsReady(discovered);
  }, [scene, onPartsReady]);

  // Apply colors and selection highlight
  useEffect(() => {
    meshMapRef.current.forEach((mesh, partId) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          const isSelected = selectedPartId === partId;
          const customColor = partColors[partId];

          if (customColor) {
            mat.color.setStyle(customColor);
          } else {
            const original = originalColorsRef.current.get(partId);
            if (original) mat.color.copy(original);
          }

          mat.emissive.set(isSelected ? 0x334155 : 0x000000);
          mat.emissiveIntensity = isSelected ? 0.12 : 0;
          mat.needsUpdate = true;
        }
      });
    });
  }, [selectedPartId, partColors]);

  // Reset colors on trigger
  useEffect(() => {
    if (resetTrigger === 0) return;
    meshMapRef.current.forEach((mesh, partId) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          const original = originalColorsRef.current.get(partId);
          if (original) mat.color.copy(original);
          mat.emissive.set(0x000000);
          mat.emissiveIntensity = 0;
          mat.needsUpdate = true;
        }
      });
    });
  }, [resetTrigger]);

  return (
    <primitive
      object={scene}
      position={[0, -0.65, 0]}
      scale={1.25}
    />
  );
};

// ─── Auto-fit camera ──────────────────────────────────────────────────────────

const AutoCamera: React.FC<{ resetTrigger: number }> = ({ resetTrigger }) => {
  const targetPos = useRef(new THREE.Vector3(0, 1.1, 3.2));

  useEffect(() => {
    targetPos.current.set(0, 1.1, 3.2);
  }, [resetTrigger]);

  return null;
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const ModelLoader: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/90 z-10 pointer-events-none">
    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
    <p className="text-sm font-semibold text-slate-600">Loading 3D model...</p>
  </div>
);

// ─── Error boundary for GLTF failures ────────────────────────────────────────

interface ErrorBoundaryState { hasError: boolean; error: string }

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (msg: string) => void },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error: error?.message || 'Failed to load model' };
  }

  componentDidCatch(error: any) {
    this.props.onError(error?.message || 'Failed to load 3D model file.');
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Main ProductModelViewer ──────────────────────────────────────────────────

interface ProductModelViewerProps {
  modelUrl: string | null | undefined;
}

export const ProductModelViewer: React.FC<ProductModelViewerProps> = ({ modelUrl }) => {
  const [parts, setParts] = useState<ModelPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [partColors, setPartColors] = useState<Record<string, string>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePartsReady = useCallback((discovered: ModelPart[]) => {
    setParts(discovered);
    if (discovered.length > 0) {
      setSelectedPartId(discovered[0].id);
    }
    setIsLoading(false);
  }, []);

  const handleModelError = useCallback((msg: string) => {
    setLoadError(msg);
    setIsLoading(false);
  }, []);

  const handleColorChange = (color: string) => {
    if (!selectedPartId) return;
    setPartColors((prev) => ({ ...prev, [selectedPartId]: color }));
  };

  const handleReset = () => {
    setPartColors({});
    setResetTrigger((t) => t + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // No model URL provided
  if (!modelUrl) {
    return (
      <div className="w-full rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 py-20 px-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <Box className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-slate-700 text-center">
          3D model is not available for this product.
        </p>
        <p className="text-xs text-slate-400 text-center max-w-xs">
          The admin has not uploaded a 3D model for this product yet.
        </p>
      </div>
    );
  }

  const selectedPart = parts.find((p) => p.id === selectedPartId);
  const currentColor = selectedPartId ? (partColors[selectedPartId] || '#888888') : '#888888';

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full'
      }`}
    >
      {/* 3D Canvas */}
      <div className="relative flex-1 min-h-[420px] bg-gradient-to-b from-slate-50 via-white to-slate-100">
        {isLoading && !loadError && <ModelLoader />}

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <p className="text-sm font-bold text-slate-900">Failed to load 3D model</p>
            <p className="text-xs text-slate-500 text-center max-w-xs px-4">{loadError}</p>
          </div>
        )}

        {!loadError && (
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 1.1, 3.2], fov: 45 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#f8fafc']} />

            {/* Lighting */}
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[5, 8, 6]}
              intensity={1.4}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-5, 4, -4]} intensity={0.5} />
            <pointLight position={[0, 6, 0]} intensity={0.3} />

            <Suspense fallback={null}>
              <ModelErrorBoundary onError={handleModelError}>
                <ModelScene
                  modelUrl={modelUrl}
                  onPartsReady={handlePartsReady}
                  selectedPartId={selectedPartId}
                  partColors={partColors}
                  resetTrigger={resetTrigger}
                />
              </ModelErrorBoundary>
            </Suspense>

            {/* Ground shadow */}
            <mesh position={[0, -0.66, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.1} />
            </mesh>

            <AutoCamera resetTrigger={resetTrigger} />

            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              minDistance={1.0}
              maxDistance={8}
              maxPolarAngle={Math.PI / 2 + 0.2}
              rotateSpeed={0.7}
              zoomSpeed={0.8}
              panSpeed={0.6}
            />
          </Canvas>
        )}

        {/* Controls overlay hint */}
        {!loadError && !isLoading && (
          <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] text-slate-500 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Drag to rotate • Scroll to zoom • Right-drag to pan</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      {!loadError && (
        <div className="border-t border-slate-200 bg-white">
          {/* Parts + Color row */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Parts list */}
            <div className="md:w-48 shrink-0 p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Model Parts ({parts.length})
              </p>
              {parts.length === 0 && isLoading ? (
                <div className="space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : parts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No parts detected</p>
              ) : (
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto scrollbar-none">
                  {parts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPartId(part.id)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all truncate ${
                        selectedPartId === part.id
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      title={part.name}
                    >
                      {part.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="flex-1 p-3 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {selectedPart ? `Color — ${selectedPart.name}` : 'Select a Part'}
              </p>
              {selectedPart ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer p-0.5 bg-white"
                    title="Pick color"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '#111827', '#dc2626', '#2563eb', '#16a34a',
                      '#d97706', '#7c3aed', '#0891b2', '#ffffff',
                      '#64748b', '#f43f5e', '#10b981', '#f59e0b',
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shadow-sm"
                        style={{
                          backgroundColor: color,
                          borderColor: currentColor === color ? '#e11d48' : 'transparent',
                          outline: currentColor === color ? '2px solid #fca5a5' : 'none',
                          outlineOffset: '1px',
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-mono text-slate-500 ml-1">{currentColor}</div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Select a part from the list to change its color
                </p>
              )}
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Colors
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-white border border-slate-200 transition-all shadow-sm"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Fullscreen
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
