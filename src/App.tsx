import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

import { useAuthStore } from './store/authStore';
import { subscribeToAuth } from './firebase/auth';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  // Synchronize Firebase Authentication state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((userProfile) => {
      setUser(userProfile);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setAuthInitialized]);

  return (
    <div className="main-layout bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      {/* Top Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 content-container py-4">
        <Routes>
          {/* User Pages */}
          <Route path="/" element={<Home setActiveTab={(tab) => { if (tab === 'products') navigate('/products'); }} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
