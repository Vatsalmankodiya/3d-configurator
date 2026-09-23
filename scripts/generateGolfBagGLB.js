import * as THREE from 'three';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create parent scene
const golfBagGroup = new THREE.Group();
golfBagGroup.name = 'GolfBag';

function createPBRMaterial(name, colorHex, roughness = 0.5, metalness = 0.1) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: roughness,
    metalness: metalness,
    side: THREE.DoubleSide
  });
  mat.name = name;
  return mat;
}

// 1. Main Body
const mainBodyGeo = new THREE.CylinderGeometry(0.32, 0.28, 1.4, 32);
const mainBodyMat = createPBRMaterial('MAT_Fabric_Main', 0x111827, 0.45, 0.05);
const mainBodyMesh = new THREE.Mesh(mainBodyGeo, mainBodyMat);
mainBodyMesh.name = 'bag_main_body';
mainBodyMesh.position.set(0, 0.7, 0);
golfBagGroup.add(mainBodyMesh);

// 2. Top Section / Cuff & Dividers
const topGeo = new THREE.CylinderGeometry(0.35, 0.33, 0.18, 32);
const topMat = createPBRMaterial('MAT_TopCuff', 0x1f2937, 0.3, 0.2);
const topMesh = new THREE.Mesh(topGeo, topMat);
topMesh.name = 'bag_top';
topMesh.position.set(0, 1.45, 0);
golfBagGroup.add(topMesh);

// 3. Bottom Base Mould
const bottomGeo = new THREE.CylinderGeometry(0.29, 0.31, 0.15, 32);
const bottomMat = createPBRMaterial('MAT_Rubber_Base', 0x0f172a, 0.7, 0.1);
const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
bottomMesh.name = 'bag_bottom';
bottomMesh.position.set(0, 0.075, 0);
golfBagGroup.add(bottomMesh);

// 4. Front Large Ball & Accessory Pocket
const frontPocketGeo = new THREE.BoxGeometry(0.36, 0.55, 0.22);
const frontPocketMat = createPBRMaterial('MAT_Fabric_FrontPocket', 0xb91c1c, 0.5, 0.05);
const frontPocketMesh = new THREE.Mesh(frontPocketGeo, frontPocketMat);
frontPocketMesh.name = 'bag_front_pocket';
frontPocketMesh.position.set(0, 0.45, 0.25);
golfBagGroup.add(frontPocketMesh);

// 5. Left Apparel Pocket
const leftPocketGeo = new THREE.BoxGeometry(0.18, 0.9, 0.38);
const leftPocketMat = createPBRMaterial('MAT_Fabric_LeftPocket', 0x111827, 0.5, 0.05);
const leftPocketMesh = new THREE.Mesh(leftPocketGeo, leftPocketMat);
leftPocketMesh.name = 'bag_left_pocket';
leftPocketMesh.position.set(-0.28, 0.7, 0);
golfBagGroup.add(leftPocketMesh);

// 6. Right Accessory Pocket
const rightPocketGeo = new THREE.BoxGeometry(0.18, 0.9, 0.38);
const rightPocketMat = createPBRMaterial('MAT_Fabric_RightPocket', 0x111827, 0.5, 0.05);
const rightPocketMesh = new THREE.Mesh(rightPocketGeo, rightPocketMat);
rightPocketMesh.name = 'bag_right_pocket';
rightPocketMesh.position.set(0.28, 0.7, 0);
golfBagGroup.add(rightPocketMesh);

// 7. Padded Shoulder Strap
const strapGeo = new THREE.TorusGeometry(0.42, 0.045, 16, 32, Math.PI * 0.9);
const strapMat = createPBRMaterial('MAT_Padded_Strap', 0x1e293b, 0.65, 0.05);
const strapMesh = new THREE.Mesh(strapGeo, strapMat);
strapMesh.name = 'bag_strap';
strapMesh.position.set(0, 0.85, -0.45);
strapMesh.rotation.set(0.2, 0, 0);
golfBagGroup.add(strapMesh);

// 8. Top Grab Handle
const handleGeo = new THREE.TorusGeometry(0.1, 0.03, 16, 24, Math.PI);
const handleMat = createPBRMaterial('MAT_Rubber_Handle', 0x020617, 0.4, 0.1);
const handleMesh = new THREE.Mesh(handleGeo, handleMat);
handleMesh.name = 'bag_handle';
handleMesh.position.set(0, 1.25, -0.38);
handleMesh.rotation.set(Math.PI / 2, 0, 0);
golfBagGroup.add(handleMesh);

// 9. Zipper Run Trims
const zipperGeo = new THREE.BoxGeometry(0.38, 0.03, 0.24);
const zipperMat = createPBRMaterial('MAT_Zipper', 0x334155, 0.3, 0.8);
const zipperMesh = new THREE.Mesh(zipperGeo, zipperMat);
zipperMesh.name = 'bag_zipper';
zipperMesh.position.set(0, 0.68, 0.25);
golfBagGroup.add(zipperMesh);

// 10. Metal Buckles & Rings
const metalGeo = new THREE.TorusGeometry(0.05, 0.012, 16, 24);
const metalMat = createPBRMaterial('MAT_Metal_Hardware', 0x94a3b8, 0.15, 0.9);
const metalMesh = new THREE.Mesh(metalGeo, metalMat);
metalMesh.name = 'bag_metal_parts';
metalMesh.position.set(0, 1.35, -0.32);
golfBagGroup.add(metalMesh);

// 11. Front Logo Badge
const logoGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.015, 32);
logoGeo.rotateX(Math.PI / 2);
const logoMat = createPBRMaterial('MAT_Metallic_Logo', 0xd97706, 0.2, 0.95);
const logoMesh = new THREE.Mesh(logoGeo, logoMat);
logoMesh.name = 'bag_logo';
logoMesh.position.set(0, 1.15, 0.33);
golfBagGroup.add(logoMesh);

const publicDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const outputPath = path.join(publicDir, 'golf-bag.json');
fs.writeFileSync(outputPath, JSON.stringify(golfBagGroup.toJSON(), null, 2));
console.log('✅ Successfully created production golf-bag.json at:', outputPath);
