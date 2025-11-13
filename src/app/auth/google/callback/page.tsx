'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api';
import { motion } from 'framer-motion';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Redirect to login with error message
      router.push(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      // Save token and redirect to dashboard
      tokenManager.set(token);
      router.push('/dashboard');
    } else {
      // No token, redirect to login
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
      </motion.div>
    </div>
  );
}
