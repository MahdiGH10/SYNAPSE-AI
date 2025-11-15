'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['#EF4444', '#F59E0B', '#FBBF24', '#10B981', '#059669'];
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError('Password must contain uppercase, lowercase, and number');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData.name, formData.email, formData.password);
      
      if (response.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060913] px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div
            className="rounded-2xl p-8 text-center backdrop-blur-xl border"
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-3">Check your email!</h2>
            <p className="text-gray-400 mb-2">
              We've sent a verification link to
            </p>
            <p className="text-blue-400 font-medium mb-6">{formData.email}</p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in your email to verify your account and start using SynapseAI.
            </p>

            <Link href="/login">
              <motion.button
                className="w-full py-3 rounded-lg font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913] px-4 py-12 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <p className="text-gray-400 text-sm">Start your AI-powered journey</p>
        </div>

        {/* Main Card */}
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
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-gray-400 text-sm">Join thousands of AI-powered teams</p>
            </div>

            {/* Google Sign-In */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full h-px"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
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
                  Or register with email
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
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm flex items-start gap-2"
                >
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
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
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                          key={level}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: level * 0.05 }}
                          className="h-1 flex-1 rounded-full"
                          style={{
                            background:
                              passwordStrength >= level ? strengthColors[passwordStrength - 1] : 'rgba(75, 85, 99, 0.3)',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: strengthColors[passwordStrength - 1] || '#9CA3AF' }}
                    >
                      {strengthLabels[passwordStrength - 1] || 'Enter a password'}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-semibold text-white relative overflow-hidden group mt-6"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                }}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      '0 0 30px rgba(59, 130, 246, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3)';
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
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-gray-400 hover:text-gray-300 underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline">
                Privacy Policy
              </Link>
            </p>
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
