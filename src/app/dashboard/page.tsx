"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  ArrowRight,
  Calendar,
  Bot,
} from "lucide-react";

const stats = [
  {
    name: "Total Conversations",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    name: "Messages Today",
    value: "43",
    change: "+8%",
    trend: "up",
    icon: Zap,
  },
  {
    name: "Avg. Response Time",
    value: "1.2s",
    change: "-15%",
    trend: "down",
    icon: Clock,
  },
  {
    name: "Active Workspaces",
    value: "5",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
  },
];

const recentActivity = [
  {
    id: 1,
    title: "Marketing Campaign Analysis",
    time: "2 minutes ago",
    type: "conversation",
  },
  {
    id: 2,
    title: "Product Roadmap Review",
    time: "1 hour ago",
    type: "conversation",
  },
  {
    id: 3,
    title: "Customer Feedback Summary",
    time: "3 hours ago",
    type: "conversation",
  },
  {
    id: 4,
    title: "Sales Report Q4 2024",
    time: "Yesterday",
    type: "conversation",
  },
];

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your AI workspace today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border backdrop-blur-xl p-6 hover:scale-105 transition-transform cursor-pointer"
                style={{
                  background: "rgba(17, 24, 39, 0.7)",
                  borderColor: "rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                    }}
                  >
                    <stat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "text-green-400 bg-green-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 rounded-2xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>

              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-white text-left"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">New Conversation</span>
                </motion.button>

                <motion.button
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-gray-300 text-left hover:bg-white/5 transition-colors border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Schedule Meeting</span>
                </motion.button>

                <motion.button
                  className="w-full flex items-center gap-3 p-4 rounded-xl text-gray-300 text-left hover:bg-white/5 transition-colors border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">View Analytics</span>
                </motion.button>
              </div>

              {/* Tips Card */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <h3 className="text-sm font-semibold text-white mb-2">💡 Pro Tip</h3>
                <p className="text-xs text-gray-400">
                  Use keyboard shortcuts to navigate faster. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">⌘K</kbd> to open quick search.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
