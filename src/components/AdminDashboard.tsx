"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Ticket,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react";
import { tokenManager } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  criticalTickets: number;
  resolvedToday: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    criticalTickets: 0,
    resolvedToday: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Prevent browser back button from going to user pages
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });
  }, []);

  const fetchStats = async () => {
    try {
      const token = tokenManager.get();
      
      // Fetch ticket stats
      const ticketResponse = await fetch("/api/tickets/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ticketData = await ticketResponse.json();

      if (ticketResponse.ok) {
        setStats((prev) => ({
          ...prev,
          totalTickets: ticketData.stats.total,
          openTickets: ticketData.stats.open,
          criticalTickets: ticketData.stats.critical,
        }));
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminCards = [
    {
      title: "Ticket Management",
      description: "View and respond to user tickets",
      icon: Ticket,
      color: "blue",
      link: "/admin/tickets",
      stats: `${stats.openTickets} open`,
    },
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: Users,
      color: "purple",
      link: "/admin/users",
      stats: "Coming soon",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: SettingsIcon,
      color: "green",
      link: "/admin/settings",
      stats: "Configure",
    },
    {
      title: "Activity Monitor",
      description: "Monitor system activity",
      icon: Activity,
      color: "orange",
      link: "/admin/activity",
      stats: "Live",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Admin Navigation Bar */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-xs text-gray-400">System Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/tickets"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Tickets
              </Link>
              <Link
                href="/admin/users"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Users
              </Link>
              <button
                onClick={() => {
                  tokenManager.remove();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-400">
                Full system access and management controls
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Tickets</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.totalTickets}
                </p>
              </div>
              <Ticket className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(234, 179, 8, 0.3)" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Open Tickets</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.openTickets}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-red-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Critical</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.criticalTickets}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Resolved</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.resolvedToday || 0}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
              className="group"
            >
              <Link href={card.link}>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border-2 border-gray-700 hover:border-blue-500 transition-all h-full cursor-pointer">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                    <span className="text-sm font-semibold text-blue-400">
                      {card.stats}
                    </span>
                    <motion.div
                      className="text-blue-400 text-xl"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border-2 border-gray-700 p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-400" />
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-gray-900 rounded-xl border-2 border-gray-700">
              <h3 className="font-bold text-white mb-3 text-lg">
                Privileges
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Full ticket management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">User role management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">System configuration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-white font-medium">Analytics access</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-gray-900 rounded-xl border-2 border-gray-700">
              <h3 className="font-bold text-white mb-3 text-lg">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/tickets"
                  className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all text-sm text-center"
                >
                  View All Tickets
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm text-center"
                >
                  Manage Users
                </Link>
                <Link
                  href="/support"
                  className="block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm text-center"
                >
                  User View
                </Link>
              </div>
            </div>

            <div className="p-5 bg-gray-900 rounded-xl border-2 border-gray-700">
              <h3 className="font-bold text-white mb-3 text-lg">
                Status
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <span className="text-gray-300 font-medium">API</span>
                  <span className="text-green-400 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <span className="text-gray-300 font-medium">Database</span>
                  <span className="text-green-400 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                  <span className="text-gray-300 font-medium">Storage</span>
                  <span className="text-green-400 font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
