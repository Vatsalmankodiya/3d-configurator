import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../firebase/auth';
import { Box, User, LogOut, Shield, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="content-container flex items-center justify-between h-20">
        {/* Logo Branding */}
        <Link to="/" className="flex items-center gap-3 group text-left outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform">
            <Box className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
                APEX<span className="text-red-600">GOLF</span>
              </span>
              <span className="badge badge-red py-0.5 px-1.5 text-[9px]">3D</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Bespoke Golf Gear
            </p>
          </div>
        </Link>

        {/* Desktop Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/90">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive(link.to)
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin Panel link — only visible to admin */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-red-600 hover:text-red-700 hover:bg-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Actions — Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 border border-slate-200 text-slate-900 font-semibold">
                <User className="w-3.5 h-3.5 text-red-600" />
                <span className="max-w-[100px] truncate">{user.displayName.split(' ')[0]}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold font-mono ${
                    user.role === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl animate-fadeIn">
          <div className="content-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-red-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive('/admin')
                    ? 'bg-slate-900 text-white'
                    : 'text-red-600 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            <div className="pt-2 border-t border-slate-100 mt-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User className="w-4 h-4 text-red-600" />
                    <span>{user.displayName.split(' ')[0]}</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold font-mono ${user.role === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
