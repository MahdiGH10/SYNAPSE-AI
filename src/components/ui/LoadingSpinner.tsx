"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-blue-500/20 border-t-blue-500`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-1/2" />
      <div className="h-4 bg-white/5 rounded w-5/6" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060913]">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative mx-auto mb-6">
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-blue-500/20 border-t-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 h-16 w-16 rounded-full border-4 border-purple-500/20 border-b-purple-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading SynapseAI</h2>
          <p className="text-sm text-gray-400">Preparing your workspace...</p>
        </motion.div>
      </div>
    </div>
  );
}
