"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { tokenManager } from "@/lib/api";
import TicketForm from "@/components/TicketForm";
import { useRouter } from "next/navigation";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = tokenManager.get();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "closed":
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Support Center
            </h1>
            <p className="text-gray-400">
              Get help with bugs, features, and support requests
            </p>
          </motion.div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTicketForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg transition-all shadow-lg shadow-red-500/20"
            >
              <AlertCircle className="w-5 h-5" />
              Report Bug
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTicketForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              New Ticket
            </motion.button>
          </div>
        </div>

        {/* Quick Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)" }}
            onClick={() => setShowTicketForm(true)}
            className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-6 cursor-pointer border border-red-500/30 hover:border-red-500/60 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/20 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Report a Bug</h3>
            <p className="text-sm text-gray-400">Found something broken? Let us know!</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
            onClick={() => setShowTicketForm(true)}
            className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 cursor-pointer border border-blue-500/30 hover:border-blue-500/60 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Get Support</h3>
            <p className="text-sm text-gray-400">Need help? We are here for you</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" }}
            onClick={() => setShowTicketForm(true)}
            className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 cursor-pointer border border-green-500/30 hover:border-green-500/60 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/20 mb-4">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Feature Request</h3>
            <p className="text-sm text-gray-400">Share your ideas with us</p>
          </motion.div>
        </motion.div>

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center shadow-lg border border-gray-700"
          >
            <LifeBuoy className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No tickets yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first support ticket to get help
            </p>
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Ticket
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, idx) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
                onClick={() => router.push(`/support/ticket/${ticket._id}`)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {ticket.status.replace("-", " ")}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {ticket.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {ticket.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {ticket.messages.length} messages
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {ticket.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
          onSuccess={() => {
            fetchTickets();
          }}
        />
      )}
    </div>
  );
}
