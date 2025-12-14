"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTicketManagement from "@/components/AdminTicketManagement";
import { tokenManager } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  role?: string;
  [key: string]: any;
}

export default function AdminTicketsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is admin or superadmin
    const token = tokenManager.get();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check role from token directly
      if (decoded.role === "admin" || decoded.role === "superadmin") {
        setAuthorized(true);
        setLoading(false);
      } else {
        router.push("/support");
      }
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 group border border-gray-700 backdrop-blur-sm"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      <AdminTicketManagement />
    </div>
  );
}
