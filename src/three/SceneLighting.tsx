import React from 'react';
import { Environment } from '@react-three/drei';

export const SceneLighting: React.FC = () => {
  return (
    <>
      {/* Soft Ambient Studio Environment */}
      <Environment preset="city" environmentIntensity={0.8} />

      {/* Global Ambient Light for dark area fill */}
      <ambientLight intensity={0.4} />

      {/* Primary Key Light (Soft Warm Studio Directional Light) */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.5}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light (Cool Soft Sky Fill) */}
      <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#e0f2fe" />

      {/* Rear Rim Light for Edge Highlights */}
      <directionalLight position={[0, 4, -5]} intensity={0.8} color="#ffffff" />
    </>
  );
};
