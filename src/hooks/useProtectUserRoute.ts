"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/lib/api';

/**
 * Hook to protect user routes from admin access
 * Redirects admins to admin panel
 */
export function useProtectUserRoute() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenManager.get();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin' || payload.role === 'superadmin') {
          console.log('Admin detected, redirecting to admin panel');
          router.push('/admin');
        }
      } catch (e) {
        console.error('Token decode error:', e);
      }
    }
  }, [router]);
}
