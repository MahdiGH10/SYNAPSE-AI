'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI, tokenManager } from '@/lib/api';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        tokenManager.set(response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913] px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue Orb */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
          }}
        />
        {/* Purple Orb */}
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
          }}
        />
        {/* Cyan Accent */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 mb-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  }}
                />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                SynapseAI
              </h1>
            </motion.div>
          </Link>
          <p className="text-gray-400 text-sm">Your AI workspace awaits</p>
        </div>

        {/* Main Card with Enhanced Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div
            className="absolute -inset-0.5 rounded-2xl blur opacity-30"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)',
            }}
          />

          {/* Card Content */}
          <div
            className="relative rounded-2xl p-8 backdrop-blur-xl border"
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm">Sign in to continue your journey</p>
            </div>

            {/* Google Sign-In */}
            <GoogleSignInButton />

            {/* Divider with Gradient */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
                  }}
                />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-4 text-xs font-medium"
                  style={{
                    background: 'rgba(17, 24, 39, 0.9)',
                    color: '#9CA3AF',
                  }}
                >
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="••••••••"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-semibold text-white relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                }}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-1/3"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  }}
                />
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-block"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          🔒 Secured by industry-standard encryption
        </motion.div>
      </motion.div>
    </div>
  );
}
