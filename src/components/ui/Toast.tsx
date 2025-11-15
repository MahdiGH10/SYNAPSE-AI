"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "rgba(16, 185, 129, 0.3)",
          text: "#10B981",
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
          text: "#EF4444",
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          border: "rgba(245, 158, 11, 0.3)",
          text: "#F59E0B",
        };
      case "info":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "rgba(59, 130, 246, 0.3)",
          text: "#3B82F6",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl shadow-xl min-w-[320px] max-w-md"
                style={{
                  background: styles.bg,
                  borderColor: styles.border,
                }}
              >
                <div style={{ color: styles.text }}>{getIcon(toast.type)}</div>
                <p className="flex-1 text-sm text-white">{toast.message}</p>
                <motion.button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
