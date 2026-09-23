import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useConfiguratorStore } from '../store/configuratorStore';
import { createLeatherBumpTexture } from '../utils/textureGenerator';

interface GolfBagModelProps {
  modelUrl: string;
}

export const GolfBagModel: React.FC<GolfBagModelProps> = ({ modelUrl }) => {
  const { 
    currentProduct, 
    configuration, 
    selectedPartId, 
    hoveredPartId, 
    selectPart, 
    setHoveredPart,
    addMissingMeshWarning 
  } = useConfiguratorStore();

  // Load GLTF Model safely with Drei
  const gltf = useGLTF(modelUrl);
  
  // Clone scene so multiple instances don't share mutated material references
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Generate procedural Leather bump map to enhance surface texture realism
  const leatherBump = useMemo(() => createLeatherBumpTexture(), []);

  // Map of partId -> THREE.Mesh
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // 1. Audit and map meshes in GLB (Requirement #39: Missing Mesh Handling)
  useEffect(() => {
    const meshMap = new Map<string, THREE.Mesh>();
    const foundMeshNames = new Set<string>();

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        foundMeshNames.add(mesh.name);
        meshMap.set(mesh.name, mesh);

        // Ensure materials are MeshStandardMaterial for PBR support
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((mat) => mat.clone());
          } else {
            mesh.material = mesh.material.clone();
          }
        }
      }
    });

    meshMapRef.current = meshMap;

    // Check for missing meshes defined in product configuration
    currentProduct.customization.parts.forEach((part) => {
      if (!foundMeshNames.has(part.meshName)) {
        console.warn(
          `⚠️ [3D Configurator Warning] Customization mesh '${part.meshName}' (Part: ${part.name}) was not found in loaded model '${modelUrl}'.`,
          `Available meshes in model:`, Array.from(foundMeshNames)
        );
        addMissingMeshWarning(part.meshName);
      }
    });
  }, [scene, currentProduct, modelUrl, addMissingMeshWarning]);

  // 2. Apply dynamic PBR material updates in real-time (Requirement #5, #11, #12, #13)
  useEffect(() => {
    currentProduct.customization.parts.forEach((part) => {
      const mesh = meshMapRef.current.get(part.meshName);
      if (!mesh) return;

      const partConfig = configuration[part.id];
      if (!partConfig) return;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          // Preserve normal maps & textures, update color, roughness, metalness
          mat.color.setStyle(partConfig.color);
          mat.roughness = partConfig.roughness;
          if (partConfig.metalness !== undefined) {
            mat.metalness = partConfig.metalness;
          }

          // Attach subtle surface texture bump if none exists
          if (!mat.bumpMap && part.category !== 'hardware') {
            mat.bumpMap = leatherBump;
            mat.bumpScale = 0.003;
          }

          // Highlight active selected part or hovered part
          const isSelected = selectedPartId === part.id;
          const isHovered = hoveredPartId === part.id;

          if (isSelected) {
            mat.emissive = new THREE.Color(0xf59e0b);
            mat.emissiveIntensity = 0.15;
          } else if (isHovered) {
            mat.emissive = new THREE.Color(0x38bdf8);
            mat.emissiveIntensity = 0.1;
          } else {
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }

          mat.needsUpdate = true;
        }
      });
    });
  }, [configuration, selectedPartId, hoveredPartId, currentProduct, leatherBump]);

  // 3. Direct Raycast Mesh Click & Hover Handlers
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const clickedMeshName = e.object.name;

    // Match clicked mesh name to customization part
    const part = currentProduct.customization.parts.find(
      (p) => p.meshName === clickedMeshName || p.id === clickedMeshName
    );

    if (part) {
      selectPart(part.id);
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const hoveredMeshName = e.object.name;
    const part = currentProduct.customization.parts.find(
      (p) => p.meshName === hoveredMeshName || p.id === hoveredMeshName
    );
    if (part) {
      setHoveredPart(part.id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <primitive 
      object={scene} 
      position={[0, -0.65, 0]} 
      scale={1.25}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
};
