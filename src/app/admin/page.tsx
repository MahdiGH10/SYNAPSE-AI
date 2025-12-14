"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import { tokenManager } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role?: string;
  [key: string]: any;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = tokenManager.get();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Admin page - Decoded token:', decoded);
      console.log('Admin page - User role:', decoded.role);
      
      // Check role from token directly
      if (decoded.role === "admin" || decoded.role === "superadmin") {
        console.log('Admin page - Access granted!');
        setAuthorized(true);
        setLoading(false);
      } else {
        console.log('Admin page - Access denied, redirecting to dashboard');
        router.push("/dashboard");
      }
    } catch (error) {
      console.log('Admin page - Token decode error:', error);
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 group border border-gray-700"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      <AdminDashboard />
    </div>
  );
}
