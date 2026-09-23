/**
 * Helper to convert file to Data URL (base64) for fallback storage
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to upload file locally to server disk under public/uploads/
 */
async function uploadFileLocally(file: File, category: 'images' | 'models'): Promise<string> {
  try {
    const uploadUrl = `/api/upload?type=${category}&name=${encodeURIComponent(file.name)}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: file
    });

    if (!response.ok) {
      throw new Error(`Local file upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.url) {
      return data.url;
    }
    throw new Error('Invalid JSON response from local upload server');
  } catch (err: any) {
    console.warn('Local API upload notice (falling back to Data URL encoding):', err.message || err);
    return await readFileAsDataURL(file);
  }
}

/**
 * Upload product image to local PC disk under /public/uploads/images/
 * Returns relative path string e.g. "/uploads/images/179..._bag.jpg"
 */
export async function uploadProductImage(file: File): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid image file type. Please upload a JPEG, PNG, WebP, or SVG image.');
  }

  return await uploadFileLocally(file, 'images');
}

/**
 * Upload 3D Model file (.glb or .gltf) to local PC disk under /public/uploads/models/
 * Returns relative path string e.g. "/uploads/models/179..._bag.glb"
 */
export async function uploadProductModel(file: File): Promise<string> {
  const fileNameLower = file.name.toLowerCase();
  const isGlbOrGltf = fileNameLower.endsWith('.glb') || fileNameLower.endsWith('.gltf');
  
  if (!isGlbOrGltf) {
    throw new Error('Invalid 3D model format. Please upload a .glb or .gltf file.');
  }

  return await uploadFileLocally(file, 'models');
}
