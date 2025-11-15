"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export default function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 w-56 rounded-xl border backdrop-blur-xl shadow-xl z-50 ${
              align === "right" ? "right-0" : "left-0"
            }`}
            style={{
              background: "rgba(17, 24, 39, 0.95)",
              borderColor: "rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="py-2">
              {items.map((item, index) => (
                <div key={index}>
                  {item.divider && <div className="my-2 border-t border-white/10" />}
                  {!item.divider && (
                    <motion.button
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        item.danger
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                      <span>{item.label}</span>
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
