"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import {
  Bell,
  Shield,
  Palette,
  Key,
  Globe,
  Moon,
  Sun,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showToast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });
  const [apiKey, setApiKey] = useState("sk_live_1234567890abcdef");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    showToast("success", "API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#060913]">
      <Sidebar onCollapse={setSidebarCollapsed} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account settings and preferences</p>
            </div>

            {/* Appearance */}
            <div
              className="rounded-2xl border backdrop-blur-xl p-6 mb-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Appearance</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white mb-1">Theme</p>
                  <p className="text-sm text-gray-400">Choose your interface theme</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setDarkMode(false)}
                    className={`p-3 rounded-lg border transition-all ${
                      !darkMode
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                        : "border-white/10 text-gray-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setDarkMode(true)}
                    className={`p-3 rounded-lg border transition-all ${
                      darkMode
                        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                        : "border-white/10 text-gray-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div
              className="rounded-2xl border backdrop-blur-xl p-6 mb-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white mb-1 capitalize">{key} Notifications</p>
                      <p className="text-sm text-gray-400">
                        Receive {key} notifications about activity
                      </p>
                    </div>
                    <motion.button
                      onClick={() =>
                        setNotifications((prev) => ({ ...prev, [key]: !value }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        value ? "bg-blue-500" : "bg-gray-600"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ x: value ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div
              className="rounded-2xl border backdrop-blur-xl p-6 mb-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Key className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">API Keys</h2>
              </div>

              <div>
                <p className="font-medium text-white mb-1">Your API Key</p>
                <p className="text-sm text-gray-400 mb-4">
                  Use this key to authenticate API requests
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg bg-black/40 border border-white/10">
                    <code className="flex-1 text-sm text-gray-300 font-mono">
                      {showApiKey ? apiKey : "•".repeat(apiKey.length)}
                    </code>
                    <motion.button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={copyApiKey}
                    className="p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div
              className="rounded-2xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Security</h2>
              </div>

              <div className="space-y-4">
                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <p className="font-medium text-white mb-1">Change Password</p>
                    <p className="text-sm text-gray-400">Update your account password</p>
                  </div>
                  <div className="text-gray-400">→</div>
                </motion.button>

                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <p className="font-medium text-white mb-1">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Add extra security to your account</p>
                  </div>
                  <div className="text-gray-400">→</div>
                </motion.button>

                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <p className="font-medium text-red-400 mb-1">Delete Account</p>
                    <p className="text-sm text-gray-400">
                      Permanently delete your account and data
                    </p>
                  </div>
                  <div className="text-red-400">→</div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
