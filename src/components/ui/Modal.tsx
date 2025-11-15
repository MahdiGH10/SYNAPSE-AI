"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative w-full ${sizeClasses[size]}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <div
                className="absolute -inset-0.5 rounded-2xl blur opacity-20"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)",
                }}
              />

              {/* Content */}
              <div
                className="relative rounded-2xl border backdrop-blur-xl"
                style={{
                  background: "rgba(17, 24, 39, 0.95)",
                  borderColor: "rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                }}
              >
                {/* Header */}
                {(title || showClose) && (
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    {title && (
                      <h2 className="text-xl font-semibold text-white">{title}</h2>
                    )}
                    {showClose && (
                      <motion.button
                        onClick={onClose}
                        className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="p-6">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
