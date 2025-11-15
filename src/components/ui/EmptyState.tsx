"use client";

import { motion } from "framer-motion";
import { Inbox, type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10"
      >
        <Icon className="h-10 w-10 text-blue-400" />
      </motion.div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-6">{description}</p>

      {action && (
        <motion.button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-lg font-medium text-white"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      )}

      {children}
    </motion.div>
  );
}
