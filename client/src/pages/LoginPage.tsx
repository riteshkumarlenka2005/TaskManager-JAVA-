import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Layers, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="ambient-bg" />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#F5E6A7]/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#E0D4FF]/5 blur-[130px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-panel w-full max-w-md p-8 relative z-10 shadow-2xl shadow-black/40"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F5E6A7]/10 flex items-center justify-center border border-[#F5E6A7]/20">
            <Layers className="w-6 h-6 text-[#F5E6A7]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TaskManager</h1>
        </div>

        <h2 className="text-xl font-semibold text-center mb-1">Welcome back</h2>
        <p className="text-center text-text-secondary text-sm mb-8">Sign in to your workspace</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-11"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full justify-center text-base py-3 disabled:opacity-50"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F5E6A7] hover:text-white transition-colors font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
