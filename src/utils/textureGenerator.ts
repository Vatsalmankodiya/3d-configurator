import * as THREE from 'three';

/**
 * Creates a seamless procedural bump texture for leather grain
 */
export function createLeatherBumpTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = 128 + Math.floor((Math.random() - 0.5) * 35);
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Creates a procedural fabric weave texture
 */
export function createFabricBumpTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#a0a0a0';
  ctx.lineWidth = 2;

  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      if ((x + y) % (step * 2) === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x + step, y);
        ctx.lineTo(x, y + step);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}
