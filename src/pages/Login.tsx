import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, registerWithEmail } from '../firebase/auth';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, LogIn, AlertCircle, Box, CheckCircle2, UserPlus } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAuthInitialized, setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);

  // Automatically redirect authenticated users away from Login page
  useEffect(() => {
    if (isAuthInitialized && isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, isAuthInitialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAccountNotFound(false);
    setLoading(true);

    try {
      const profile = await loginWithEmail(email, password);
      setUser(profile);
      setSuccess(`Logged in successfully as ${profile.role.toUpperCase()}! Redirecting...`);
      navigate(profile.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Account not found or password incorrect. You can create a new account below!');
        setAccountNotFound(true);
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'Failed to log in. Please verify your credentials.');
      }
      setLoading(false);
    }
  };

  const handleQuickCreateAccount = async () => {
    if (!email || !password) {
      setError('Please fill in both Email and Password first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const displayName = email.split('@')[0] || 'User';
      const profile = await registerWithEmail(email, password, displayName);
      setUser(profile);
      setSuccess(`Account registered successfully! Redirecting...`);
      navigate(profile.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-6 glass-panel p-8 rounded-2xl bg-white border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-red-500/25">
            <Box className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Sign In to ApexGolf
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800 font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3 text-xs text-red-700 font-semibold animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            {accountNotFound && (
              <button
                type="button"
                onClick={handleQuickCreateAccount}
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account with entered details now</span>
              </button>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@apexgolf.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium outline-none focus:border-red-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium outline-none focus:border-red-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Testing Helper */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Fill for Testing:
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('user@apexgolf.com');
                setPassword('password123');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
            >
              Fill User
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@apexgolf.com');
                setPassword('password123');
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-all"
            >
              Fill Admin
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 hover:text-red-700 font-bold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
