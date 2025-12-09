'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api';
import { motion } from 'framer-motion';

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for session to load
      if (status === 'loading') return;

      // If no session, redirect to login
      if (status === 'unauthenticated') {
        router.push('/auth/login?error=authentication_failed');
        return;
      }

      // If authenticated, generate JWT token from session
      if (status === 'authenticated' && session?.user) {
        try {
          // Call our backend to generate JWT token
          const response = await fetch('/api/auth/google/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('Token generation failed:', data);
            throw new Error(data.error || 'Failed to generate token');
          }
          
          
          if (data.token) {
            // Store JWT token
            tokenManager.set(data.token);
            // Redirect to dashboard
            router.push('/dashboard');
          } else {
            throw new Error('No token received');
          }
        } catch (err) {
          console.error('Callback error:', err);
          setError('Failed to complete sign in');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      }
    };

    handleCallback();
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060913]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {error ? (
          <>
            <div className="text-red-500 mb-4 text-xl">❌</div>
            <h2 className="text-xl font-semibold text-white">{error}</h2>
            <p className="text-gray-400 mt-2">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
            <p className="text-gray-400 mt-2">Please wait...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
