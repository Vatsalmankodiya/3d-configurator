import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore, CameraPreset } from '../store/configuratorStore';

const PRESET_POSITIONS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  default: { pos: [0, 1.1, 3.2], target: [0, 0.7, 0] },
  front: { pos: [0, 0.8, 2.8], target: [0, 0.65, 0] },
  back: { pos: [0, 0.8, -2.8], target: [0, 0.65, 0] },
  left: { pos: [-2.8, 0.8, 0], target: [0, 0.65, 0] },
  right: { pos: [2.8, 0.8, 0], target: [0, 0.65, 0] },
  top: { pos: [0, 3.2, 0.2], target: [0, 0.8, 0] },
  strap: { pos: [0.5, 1.2, -2.2], target: [0, 0.9, -0.4] }
};

export const CameraControls: React.FC = () => {
  const { cameraPreset, autoRotate } = useConfiguratorStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_POSITIONS.default.pos));
  const targetLookRef = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_POSITIONS.default.target));

  const { camera } = useThree();

  useEffect(() => {
    const config = PRESET_POSITIONS[cameraPreset] || PRESET_POSITIONS.default;
    targetPosRef.current.set(...config.pos);
    targetLookRef.current.set(...config.target);
  }, [cameraPreset]);

  // Smooth lerp towards active camera target
  useFrame((_, delta) => {
    if (controlsRef.current) {
      camera.position.lerp(targetPosRef.current, delta * 4);
      controlsRef.current.target.lerp(targetLookRef.current, delta * 4);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={true}
      minDistance={1.3}
      maxDistance={4.8}
      maxPolarAngle={Math.PI / 2 + 0.1}
      autoRotate={autoRotate}
      autoRotateSpeed={1.5}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
    />
  );
};
