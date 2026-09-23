import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Box,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ModelPart {
  id: string;
  name: string;
}

// ─── ModelScene ────────────────────────────────────────────────────────────────
// Loads the GLTF, normalises it to a fixed-size box centred at origin,
// discovers all mesh parts, and applies per-part colour changes.

interface SceneProps {
  modelUrl: string;
  onPartsReady: (parts: ModelPart[]) => void;
  onLoaded: () => void;
  selectedPartId: string | null;
  partColors: Record<string, string>;
  meshMapRef: React.MutableRefObject<Map<string, THREE.Mesh>>;
  originalColorsRef: React.MutableRefObject<Map<string, THREE.Color>>;
  resetTrigger: number;
}

const ModelScene: React.FC<SceneProps> = ({
  modelUrl,
  onPartsReady,
  onLoaded,
  selectedPartId,
  partColors,
  meshMapRef,
  originalColorsRef,
  resetTrigger,
}) => {
  const gltf = useGLTF(modelUrl);
  const didDiscover = useRef(false);

  // Clone scene + all materials so this instance is fully independent
  const { normalizedScene, normScale, normOffset } = useMemo(() => {
    const cloned = gltf.scene.clone(true);

    // Deep-clone every mesh material so colour changes don't bleed across instances
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else if (mesh.material) {
        mesh.material = (mesh.material as THREE.Material).clone();
      }
    });

    // Compute the bounding box of the cloned scene
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    // Normalise: longest side = 2 units, centred at world origin
    const scale = 2 / maxDim;
    const offset = center.clone().multiplyScalar(scale);

    return { normalizedScene: cloned, normScale: scale, normOffset: offset };
  }, [gltf.scene]);

  // Discover all meshes once when the scene first loads
  useEffect(() => {
    if (didDiscover.current) return;
    didDiscover.current = true;

    meshMapRef.current.clear();
    originalColorsRef.current.clear();

    const discovered: ModelPart[] = [];
    const nameCount = new Map<string, number>();

    normalizedScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      const baseName = (mesh.name?.trim()) || 'Part';
      const count = (nameCount.get(baseName) ?? 0) + 1;
      nameCount.set(baseName, count);
      const partId = count > 1 ? `${baseName}_${count}` : baseName;

      meshMapRef.current.set(partId, mesh);

      // Record original colour (works for any colour-bearing material)
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      let origColor: THREE.Color | null = null;
      for (const mat of mats) {
        const c = (mat as any).color;
        if (c instanceof THREE.Color) { origColor = c.clone(); break; }
      }
      originalColorsRef.current.set(partId, origColor ?? new THREE.Color(0x888888));

      discovered.push({ id: partId, name: baseName });
    });

    onPartsReady(discovered);
    onLoaded();
  }, [normalizedScene, meshMapRef, originalColorsRef, onPartsReady, onLoaded]);

  // Apply per-part colour changes whenever selection or colours change
  useEffect(() => {
    meshMapRef.current.forEach((mesh, partId) => {
      const isSelected = selectedPartId === partId;
      const customColor = partColors[partId];
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      mats.forEach((mat) => {
        const m = mat as any;
        if (!(m.color instanceof THREE.Color)) return;

        // Colour
        if (customColor) {
          m.color.setStyle(customColor);
        } else {
          const orig = originalColorsRef.current.get(partId);
          if (orig) m.color.copy(orig);
        }

        // Selection highlight (emissive, only if supported)
        if (m.emissive instanceof THREE.Color) {
          m.emissive.set(isSelected ? 0x2d3748 : 0x000000);
          m.emissiveIntensity = isSelected ? 0.18 : 0;
        }

        m.needsUpdate = true;
      });
    });
  }, [selectedPartId, partColors, meshMapRef, originalColorsRef]);

  // Reset colours to original
  useEffect(() => {
    if (resetTrigger === 0) return;
    meshMapRef.current.forEach((mesh, partId) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const m = mat as any;
        if (!(m.color instanceof THREE.Color)) return;
        const orig = originalColorsRef.current.get(partId);
        if (orig) m.color.copy(orig);
        if (m.emissive instanceof THREE.Color) {
          m.emissive.set(0x000000);
          m.emissiveIntensity = 0;
        }
        m.needsUpdate = true;
      });
    });
  }, [resetTrigger, meshMapRef, originalColorsRef]);

  return (
    /*
      Position: shift by -offset so the model's original centre lands at [0,0,0].
      Scale: normScale so the longest dimension = 2 world units.
      The camera is fixed at [0, 0.4, 4] which always frames a 2-unit object.
    */
    <primitive
      object={normalizedScene}
      position={[-normOffset.x, -normOffset.y, -normOffset.z]}
      scale={normScale}
    />
  );
};

// ─── Loading overlay ───────────────────────────────────────────────────────────

const ModelLoader: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/95 z-10 pointer-events-none">
    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
    <p className="text-sm font-semibold text-slate-600">Loading 3D model…</p>
  </div>
);

// ─── Error boundary ────────────────────────────────────────────────────────────

class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (msg: string) => void },
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
    this.props.onError(
      error?.message ?? 'Could not load the 3D model. Ensure the file is a valid .glb or .gltf.'
    );
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Main ProductModelViewer ───────────────────────────────────────────────────

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
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const originalColorsRef = useRef<Map<string, THREE.Color>>(new Map());

  // Reset everything when URL changes
  useEffect(() => {
    setParts([]);
    setSelectedPartId(null);
    setPartColors({});
    setLoadError(null);
    setIsLoading(true);
    setResetTrigger(0);
    meshMapRef.current.clear();
    originalColorsRef.current.clear();
  }, [modelUrl]);

  const handlePartsReady = useCallback((discovered: ModelPart[]) => {
    setParts(discovered);
    if (discovered.length > 0) setSelectedPartId(discovered[0].id);
  }, []);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleModelError = useCallback((msg: string) => {
    setLoadError(msg);
    setIsLoading(false);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    if (!selectedPartId) return;
    setPartColors((prev) => ({ ...prev, [selectedPartId]: color }));
  }, [selectedPartId]);

  const handleReset = useCallback(() => {
    setPartColors({});
    setResetTrigger((t) => t + 1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── No model ────────────────────────────────────────────────────────────────

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
  const currentColor = selectedPartId ? (partColors[selectedPartId] ?? '#888888') : '#888888';

  const PRESETS = [
    '#111827', '#dc2626', '#2563eb', '#16a34a',
    '#d97706', '#7c3aed', '#0891b2', '#f8fafc',
    '#64748b', '#f43f5e', '#10b981', '#f59e0b',
  ];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-none' : 'w-full'
      }`}
    >
      {/* ── 3D Canvas ─────────────────────────────────────────────────────────── */}
      <div
        className="relative bg-gradient-to-b from-slate-50 to-slate-100"
        style={{ height: isFullscreen ? 'calc(100vh - 160px)' : '460px' }}
      >
        {/* Loading overlay */}
        {isLoading && !loadError && <ModelLoader />}

        {/* Error state */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50 z-10 p-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">Failed to load 3D model</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">{loadError}</p>
            </div>
          </div>
        )}

        {!loadError && (
          <Canvas
            shadows
            dpr={[1, 1.5]}
            /*
              Camera fixed at a position that always works for a normalised 2-unit object.
              FOV 50°, camera at z=4 → visible height ≈ 2*4*tan(25°) ≈ 3.7 units.
              The model's longest side is 2 units, so it fits with comfortable padding.
            */
            camera={{ position: [0, 0.4, 4], fov: 50, near: 0.01, far: 500 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['#f8fafc']} />

            {/* Balanced lighting that works for any model colour */}
            <ambientLight intensity={1.4} />
            <directionalLight
              position={[3, 6, 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-4, 3, -3]} intensity={0.7} />
            <directionalLight position={[0, -3, 2]} intensity={0.25} />
            <hemisphereLight args={['#ffffff', '#9ba3af', 0.6]} />

            <Suspense fallback={null}>
              <ModelErrorBoundary onError={handleModelError}>
                <ModelScene
                  modelUrl={modelUrl}
                  onPartsReady={handlePartsReady}
                  onLoaded={handleLoaded}
                  selectedPartId={selectedPartId}
                  partColors={partColors}
                  meshMapRef={meshMapRef}
                  originalColorsRef={originalColorsRef}
                  resetTrigger={resetTrigger}
                />
              </ModelErrorBoundary>
            </Suspense>

            {/* Soft shadow plane, sitting just below origin */}
            <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <shadowMaterial opacity={0.07} />
            </mesh>

            <OrbitControls
              makeDefault
              target={[0, 0, 0]}
              enablePan
              enableZoom
              enableDamping
              dampingFactor={0.07}
              minDistance={0.5}
              maxDistance={20}
              rotateSpeed={0.65}
              zoomSpeed={0.9}
            />
          </Canvas>
        )}

        {/* Hint */}
        {!loadError && !isLoading && (
          <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] text-slate-500 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Drag · Scroll · Right-drag to pan</span>
          </div>
        )}
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────────────── */}
      {!loadError && (
        <div className="border-t border-slate-200 bg-white shrink-0">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* Part list */}
            <div className="md:w-52 shrink-0 p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Parts {parts.length > 0 && `(${parts.length})`}
              </p>

              {isLoading ? (
                <div className="space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : parts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No parts detected</p>
              ) : (
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto scrollbar-none">
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

            {/* Colour picker */}
            <div className="flex-1 p-3 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {selectedPart ? `Colour — ${selectedPart.name}` : 'Select a Part'}
              </p>

              {selectedPart ? (
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={currentColor.startsWith('#') ? currentColor : '#888888'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                    title="Custom colour"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-6 h-6 rounded-full border-[2px] transition-transform hover:scale-110 shadow-sm"
                        style={{
                          backgroundColor: color,
                          borderColor: currentColor === color ? '#e11d48' : 'rgba(0,0,0,0.12)',
                          outline: currentColor === color ? '2px solid #fca5a5' : 'none',
                          outlineOffset: '1px',
                        }}
                        title={color}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono text-slate-400">{currentColor}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Click a part on the left to change its colour
                </p>
              )}
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Colours
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-white border border-slate-200 transition-all shadow-sm"
            >
              {isFullscreen ? (
                <><Minimize2 className="w-3.5 h-3.5" /> Exit Fullscreen</>
              ) : (
                <><Maximize2 className="w-3.5 h-3.5" /> Fullscreen</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
