"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,

  User,
  Sparkles,
  ChevronLeft,
  LogOut,
  Podcast,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/hooks/UseLogout";

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  {name: "exercice", href: "/exercice", icon: FileText},
  { name: "community", href: "Post", icon: Podcast },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('email');

  useEffect(() => {
    // Load user data from localStorage after component mounts
    const storedUsername = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse?.(newState);
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen border-r backdrop-blur-xl z-40"
      style={{
        background: "rgba(17, 24, 39, 0.8)",
        borderColor: "rgba(59, 130, 246, 0.1)",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SynapseAI
              </span>
            </Link>
          )}
          <motion.button
            onClick={toggleCollapse}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>



        {/* User Profile */}
        <div className="border-t border-white/10 p-4">
          <motion.button
            className="flex items-center gap-3 w-full rounded-xl p-3 hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{username}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
                <LogOut onClick={logout} className="h-5 w-5 text-gray-400" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}
