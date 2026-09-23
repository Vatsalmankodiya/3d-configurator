import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserProfile } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { logoutUser } from '../firebase/auth';
import { subscribeToUsersCollection, fetchAllUsersFromFirestore } from '../firebase/users';
import { fetchProductsFromFirestore, addProductToFirestore } from '../firebase/products';
import { uploadProductImage, uploadProductModel } from '../firebase/storage';
import { 
  Users as UsersIcon, 
  Package, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck, 
  Upload, 
  FileBox, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  DollarSign
} from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { products, setProducts, addProduct } = useProductStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'products' | 'add-product'>('dashboard');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Add Product Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Subscribe to real-time Users & Products from Firestore DB
  useEffect(() => {
    setLoadingUsers(true);
    setLoadingProducts(true);

    // Initial fetch for users
    fetchAllUsersFromFirestore().then((initialUsers) => {
      let combined = initialUsers;
      if (user && !combined.some(u => u.uid === user.uid || u.email === user.email)) {
        combined = [user, ...combined];
      }
      setUsersList(combined);
      setLoadingUsers(false);
    });

    // Real-time listener for Users collection
    const unsubscribeUsers = subscribeToUsersCollection((firestoreUsers) => {
      let combined = firestoreUsers;
      if (user && !combined.some(u => u.uid === user.uid || u.email === user.email)) {
        combined = [user, ...combined];
      }
      setUsersList(combined);
      setLoadingUsers(false);
    });

    // Fetch products
    fetchProductsFromFirestore().then((firestoreProducts) => {
      setProducts(firestoreProducts);
      setLoadingProducts(false);
    }).catch(() => setLoadingProducts(false));

    return () => {
      unsubscribeUsers();
    };
  }, [setProducts, user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setFormError('Invalid image file type. Please select a JPG, PNG, WebP, or SVG file.');
      setImageFile(null);
      return;
    }

    setFormError('');
    setImageFile(file);
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    const isGlbOrGltf = fileNameLower.endsWith('.glb') || fileNameLower.endsWith('.gltf');

    if (!isGlbOrGltf) {
      setFormError('Invalid 3D model format. Only .glb or .gltf files are allowed.');
      setModelFile(null);
      return;
    }

    setFormError('');
    setModelFile(file);
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setFormError('Please enter a valid price.');
      return;
    }
    if (!imageFile) {
      setFormError('Please select a product image file.');
      return;
    }
    if (!modelFile) {
      setFormError('Please select a 3D model (.glb or .gltf) file.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save Product Image to local PC disk (/public/uploads/images/)
      setUploadStatus('Saving product image to local server disk...');
      const imageUrl = await uploadProductImage(imageFile);

      // 2. Save 3D Model file (.glb) to local PC disk (/public/uploads/models/)
      setUploadStatus('Saving 3D model (.glb) to local server disk...');
      const modelUrl = await uploadProductModel(modelFile);

      // 3. Save Product Document to Firestore DB
      setUploadStatus('Saving product metadata and local file path to Firestore...');
      const newProd = await addProductToFirestore({
        name,
        description,
        price: Number(price),
        imageUrl,
        modelUrl,
        createdBy: user?.uid || 'admin'
      });

      // Update store
      addProduct(newProd);

      setFormSuccess('Product created and saved to Firebase successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setModelFile(null);
      setUploadStatus('');

      // Switch back to Products tab to display newly added product
      setTimeout(() => {
        setFormSuccess('');
        setActiveTab('products');
      }, 1200);

    } catch (err: any) {
      console.error('Failed to create product:', err);
      setFormError(err.message || 'Failed to upload files or save product.');
    } finally {
      setIsSubmitting(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="space-y-6 py-6 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-600/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 font-heading">
                Admin Panel
              </h1>
              <span className="badge badge-red py-0.5 px-2 text-[10px] uppercase font-bold tracking-wider">
                Admin Role
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manage Registered Users, Admin Products, and Firebase Storage 3D Models
            </p>
          </div>
        </div>

        {/* Tab Navigation & Logout */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'users'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span>Users ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add-product'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm ml-auto sm:ml-0"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 1. Dashboard View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Users Card */}
            <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Users
                </span>
                <p className="text-4xl font-black text-slate-900 font-heading">
                  {loadingUsers ? '...' : usersList.length}
                </p>
                <p className="text-[11px] text-slate-500">Registered Users (Firestore DB)</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <UsersIcon className="w-7 h-7" />
              </div>
            </div>

            {/* Total Products Card */}
            <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Products
                </span>
                <p className="text-4xl font-black text-slate-900 font-heading">
                  {loadingProducts ? '...' : products.length}
                </p>
                <p className="text-[11px] text-slate-500">Admin-Added Products</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <Package className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Users Page */}
      {activeTab === 'users' && (
        <div className="glass-panel bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Registered Users ({usersList.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Firestore 'users' collection</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400 font-mono">
                      No registered users found in database.
                    </td>
                  </tr>
                ) : (
                  usersList.map((usr) => (
                    <tr key={usr.uid} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{usr.displayName}</td>
                      <td className="p-3.5 font-mono text-slate-600">{usr.email}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                          usr.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Products Page */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Admin Products ({products.length})
              </h3>
              <p className="text-[11px] text-slate-500">Only showing products added by Admin</p>
            </div>

            <button
              onClick={() => setActiveTab('add-product')}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full p-12 text-center text-slate-400 glass-panel bg-white border-slate-200 rounded-2xl space-y-3">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No products added yet.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Add Product" above to upload your first product image and 3D model (.glb)!
                </p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              </div>
            ) : (
              products.map((prod) => (
                <div key={prod.id} className="glass-card bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="h-40 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200">
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">No Image</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      {prod.modelUrl ? (
                        <span className="badge badge-emerald text-[9px] font-bold flex items-center gap-1 shadow-sm">
                          <FileBox className="w-3 h-3" />
                          3D Uploaded
                        </span>
                      ) : (
                        <span className="badge badge-red text-[9px] font-bold">No 3D Model</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm font-heading truncate">
                        {prod.name}
                      </h4>
                      <span className="text-red-600 font-extrabold text-sm font-mono">
                        ${prod.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {prod.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Add Product Page */}
      {activeTab === 'add-product' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-red-600" />
              Add New Product & 3D Model
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload product image and 3D model (.glb/.gltf) directly to Firebase Storage
            </p>
          </div>

          {/* Form Feedback */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* Upload Progress Status */}
          {isSubmitting && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
              <div className="w-6 h-6 border-3 border-slate-300 border-t-red-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 font-mono">{uploadStatus}</p>
            </div>
          )}

          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
            {/* Product Name */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apex Tour Pro Golf Bag"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:border-red-600"
              />
            </div>

            {/* Product Price */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299.99"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Product Description */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product specifications, features, and overview..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:border-red-600"
              />
            </div>

            {/* Product Image File */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Image File *
              </label>
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-2 hover:border-red-500 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-medium">
                  {imageFile ? imageFile.name : 'Click to select product image (JPG, PNG, WebP)'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
            </div>

            {/* 3D Model File Upload (.glb/.gltf) */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                3D Model File (.glb / .gltf) *
              </label>
              <div className="p-4 bg-red-50/50 border-2 border-dashed border-red-200 rounded-xl text-center space-y-2 hover:border-red-600 transition-colors">
                <FileBox className="w-7 h-7 text-red-600 mx-auto" />
                <p className="text-slate-700 font-bold">
                  {modelFile ? modelFile.name : 'Click to upload 3D Model file (.glb or .gltf)'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Model file will be stored in Firebase Storage under <span className="font-mono text-red-600">/products/models/</span>
                </p>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  required
                  onChange={handleModelFileChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-red-600"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Uploading to Firebase...' : 'Save Product & Upload 3D Model'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
