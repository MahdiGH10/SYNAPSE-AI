{/* Mobile Menu x

"use client";

import { motion } from "framer-motion";
import { Bell, Search, Menu } from "lucide-react";
import Dropdown from "../ui/Dropdown";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{
        background: "rgba(17, 24, 39, 0.8)",
        borderColor: "rgba(59, 130, 246, 0.1)",
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

       
        <div className="flex items-center gap-3 ml-4">
          
          <Dropdown
            trigger={
              <motion.button
                className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
            }
            items={[
              {
                label: "New message from AI",
                onClick: () => console.log("Notification 1"),
              },
              {
                label: "Workspace updated",
                onClick: () => console.log("Notification 2"),
              },
              { divider: true },
              {
                label: "Mark all as read",
                onClick: () => console.log("Mark all read"),
              },
            ]}
          />
        </div>
      </div>
    </motion.header>
  );
}
{/* Mobile Menu */}