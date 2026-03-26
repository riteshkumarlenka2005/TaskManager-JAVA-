import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layers, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center relative overflow-hidden px-4 font-['Outfit']">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#BEC4FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#18181B] rounded-[40px] p-10 md:p-16 shadow-2xl ring-1 ring-white/5 relative overflow-hidden">
          {/* Brand Icon */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 rounded-[24px] bg-[#222226] flex items-center justify-center border border-white/5 shadow-2xl mb-6">
              <Layers className="w-8 h-8 text-[#BEC4FF]" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-[#7C8B93] font-bold text-sm tracking-widest uppercase">Elite Workspace Entry</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8B93] ml-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#222226] border-none rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-[#BEC4FF] transition-all placeholder:text-[#4F5B62] font-medium"
                placeholder="identity..."
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8B93]">Password</label>
                <a href="#" className="text-[10px] font-black text-[#BEC4FF] uppercase tracking-widest hover:opacity-80 transition-opacity">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#222226] border-none rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-[#BEC4FF] transition-all placeholder:text-[#4F5B62] font-medium pr-16"
                  placeholder="secure key..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#7C8B93] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BEC4FF] hover:bg-[#D6DAFF] text-black font-black py-5 rounded-[24px] transition-all shadow-xl shadow-[#BEC4FF]/10 flex items-center justify-center gap-2 group h-16"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Connect <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-[#7C8B93] text-sm font-bold">
              New to the system?{' '}
              <Link to="/register" className="text-white hover:text-[#BEC4FF] transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-10 text-center">
            <p className="text-[#4F5B62] text-[10px] font-black uppercase tracking-[0.4em]">Integrated Task Management Hub • v3.2.0</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
