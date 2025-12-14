"use client";

import DocumentWorkspace from '@/components/DocumentWorkspace';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  
  return (
    <div className="relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 group border border-gray-700 backdrop-blur-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      <DocumentWorkspace />
    </div>
  );
}
