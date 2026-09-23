import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { loginWithEmail, registerWithEmail } from '../../firebase/auth';
import { X, User, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, setUser } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('pro.golfer@apexgolf.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alexander Vance');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister) {
        const user = await registerWithEmail(email, password, name);
        setUser(user);
        setSuccessMsg('Account registered successfully!');
      } else {
        const user = await loginWithEmail(email, password);
        setUser(user);
        setSuccessMsg('Logged in successfully!');
      }

      setTimeout(() => {
        setSuccessMsg('');
        setAuthModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl space-y-6">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            {isRegister ? 'Create Customer Locker' : 'Welcome Back to ApexGolf'}
          </h3>
          <p className="text-xs text-slate-500">
            Sign in to access your saved 3D golf bag configurations
          </p>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-sm font-semibold text-emerald-800">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            {isRegister && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alexander Vance"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pro.golfer@apexgolf.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-xs font-bold shadow-lg shadow-red-600/20"
            >
              {isLoading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-slate-500 hover:text-red-600 text-xs transition-colors font-medium"
              >
                {isRegister
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
