import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useConfiguratorStore } from '../store/configuratorStore';
import { createLeatherBumpTexture } from '../utils/textureGenerator';

export const ProceduralGolfBag: React.FC = () => {
  const { 
    currentProduct, 
    configuration, 
    selectedPartId, 
    hoveredPartId, 
    selectPart, 
    setHoveredPart 
  } = useConfiguratorStore();

  const bumpTex = useMemo(() => createLeatherBumpTexture(), []);

  // Helper to create material props based on configuration state
  const getMaterial = (partId: string, defaultColor = '#111827', defaultRoughness = 0.5, defaultMetalness = 0.1) => {
    const config = configuration[partId] || { color: defaultColor, roughness: defaultRoughness, metalness: defaultMetalness };
    const isSelected = selectedPartId === partId;
    const isHovered = hoveredPartId === partId;

    return (
      <meshStandardMaterial
        color={config.color}
        roughness={config.roughness}
        metalness={config.metalness ?? defaultMetalness}
        bumpMap={bumpTex}
        bumpScale={0.003}
        emissive={isSelected ? '#f59e0b' : isHovered ? '#38bdf8' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.1 : 0}
      />
    );
  };

  const handlePointerDown = (partId: string, e: any) => {
    e.stopPropagation();
    selectPart(partId);
  };

  const handlePointerOver = (partId: string, e: any) => {
    e.stopPropagation();
    setHoveredPart(partId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={[0, -0.65, 0]} scale={1.25}>
      {/* 1. Main Body */}
      <mesh
        name="bag_main_body"
        position={[0, 0.7, 0]}
        onPointerDown={(e) => handlePointerDown('bag_main_body', e)}
        onPointerOver={(e) => handlePointerOver('bag_main_body', e)}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.32, 0.28, 1.4, 32]} />
        {getMaterial('bag_main_body', '#111827', 0.45)}
      </mesh>

      {/* 2. Top Cuff Ring */}
      <mesh
        name="bag_top"
        position={[0, 1.45, 0]}
        onPointerDown={(e) => handlePointerDown('bag_top', e)}
        onPointerOver={(e) => handlePointerOver('bag_top', e)}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.35, 0.33, 0.18, 32]} />
        {getMaterial('bag_top', '#1f2937', 0.3, 0.2)}
      </mesh>

      {/* 3. Bottom Base */}
      <mesh
        name="bag_bottom"
        position={[0, 0.075, 0]}
        onPointerDown={(e) => handlePointerDown('bag_bottom', e)}
        onPointerOver={(e) => handlePointerOver('bag_bottom', e)}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.29, 0.31, 0.15, 32]} />
        {getMaterial('bag_bottom', '#0f172a', 0.7)}
      </mesh>

      {/* 4. Front Pocket */}
      <mesh
        name="bag_front_pocket"
        position={[0, 0.45, 0.25]}
        onPointerDown={(e) => handlePointerDown('bag_front_pocket', e)}
        onPointerOver={(e) => handlePointerOver('bag_front_pocket', e)}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.36, 0.55, 0.22]} />
        {getMaterial('bag_front_pocket', '#b91c1c', 0.5)}
      </mesh>

      {/* 5. Left Apparel Pocket */}
      <mesh
        name="bag_left_pocket"
        position={[-0.28, 0.7, 0]}
        onPointerDown={(e) => handlePointerDown('bag_left_pocket', e)}
        onPointerOver={(e) => handlePointerOver('bag_left_pocket', e)}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.18, 0.9, 0.38]} />
        {getMaterial('bag_left_pocket', '#111827', 0.5)}
      </mesh>

      {/* 6. Right Accessory Pocket */}
      <mesh
        name="bag_right_pocket"
        position={[0.28, 0.7, 0]}
        onPointerDown={(e) => handlePointerDown('bag_right_pocket', e)}
        onPointerOver={(e) => handlePointerOver('bag_right_pocket', e)}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.18, 0.9, 0.38]} />
        {getMaterial('bag_right_pocket', '#111827', 0.5)}
      </mesh>

      {/* 7. Shoulder Strap */}
      <mesh
        name="bag_strap"
        position={[0, 0.85, -0.45]}
        rotation={[0.2, 0, 0]}
        onPointerDown={(e) => handlePointerDown('bag_strap', e)}
        onPointerOver={(e) => handlePointerOver('bag_strap', e)}
        onPointerOut={handlePointerOut}
      >
        <torusGeometry args={[0.42, 0.045, 16, 32, Math.PI * 0.9]} />
        {getMaterial('bag_strap', '#1e293b', 0.65)}
      </mesh>

      {/* 8. Top Handle */}
      <mesh
        name="bag_handle"
        position={[0, 1.25, -0.38]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={(e) => handlePointerDown('bag_handle', e)}
        onPointerOver={(e) => handlePointerOver('bag_handle', e)}
        onPointerOut={handlePointerOut}
      >
        <torusGeometry args={[0.1, 0.03, 16, 24, Math.PI]} />
        {getMaterial('bag_handle', '#020617', 0.4)}
      </mesh>

      {/* 9. Zipper Run */}
      <mesh
        name="bag_zipper"
        position={[0, 0.68, 0.25]}
        onPointerDown={(e) => handlePointerDown('bag_zipper', e)}
        onPointerOver={(e) => handlePointerOver('bag_zipper', e)}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.38, 0.03, 0.24]} />
        {getMaterial('bag_zipper', '#334155', 0.3, 0.8)}
      </mesh>

      {/* 10. Metal Rings */}
      <mesh
        name="bag_metal_parts"
        position={[0, 1.35, -0.32]}
        onPointerDown={(e) => handlePointerDown('bag_metal_parts', e)}
        onPointerOver={(e) => handlePointerOver('bag_metal_parts', e)}
        onPointerOut={handlePointerOut}
      >
        <torusGeometry args={[0.05, 0.012, 16, 24]} />
        {getMaterial('bag_metal_parts', '#94a3b8', 0.15, 0.9)}
      </mesh>

      {/* 11. Front Logo Badge */}
      <mesh
        name="bag_logo"
        position={[0, 1.15, 0.33]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={(e) => handlePointerDown('bag_logo', e)}
        onPointerOver={(e) => handlePointerOver('bag_logo', e)}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.015, 32]} />
        {getMaterial('bag_logo', '#d97706', 0.2, 0.95)}
      </mesh>
    </group>
  );
};
