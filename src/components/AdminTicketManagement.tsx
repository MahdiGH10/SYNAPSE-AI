"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  User,
  Calendar,
  Tag,
  Filter,
} from "lucide-react";
import { tokenManager } from "@/lib/api";

interface TicketMessage {
  sender: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  senderRole: string;
  message: string;
  timestamp: string;
}

interface TicketData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  messages: TicketMessage[];
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  critical: number;
  highPriority: number;
  unassigned: number;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function AdminTicketManagement() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = tokenManager.get();
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

  const fetchStats = async () => {
    try {
      const token = tokenManager.get();
      const response = await fetch("/api/tickets/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setSendingReply(true);
    try {
      const token = tokenManager.get();
      const response = await fetch(`/api/tickets/${selectedTicket._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyMessage }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedTicket(data.ticket);
        setReplyMessage("");
        fetchTickets();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const token = tokenManager.get();
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedTicket(data.ticket);
        fetchTickets();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateTicketPriority = async (ticketId: string, priority: string) => {
    try {
      const token = tokenManager.get();
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedTicket(data.ticket);
        fetchTickets();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ticket Management
          </h1>
          <p className="text-gray-300">
            Manage and respond to user tickets
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border-2 border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Open Tickets</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats.open}</p>
                </div>
                <Ticket className="w-12 h-12 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border-2 border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">In Progress</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats.inProgress}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border-2 border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Critical</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border-2 border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Resolved</p>
                  <p className="text-4xl font-bold text-white mt-2">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border-2 border-gray-700 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Filters
                </h2>
              </div>
              
              <div className="space-y-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedTicket?._id === ticket._id
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-gray-600 bg-gray-900 hover:border-blue-400"
                  }`}
                >
                  <h3 className="font-semibold text-white mb-2 truncate">
                    {ticket.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        ticket.priority === 'low' ? 'bg-blue-500/20 text-blue-300' :
                        ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        ticket.status === 'open' ? 'bg-blue-500/20 text-blue-300' :
                        ticket.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        ticket.status === 'resolved' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    by {ticket.userId.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border-2 border-gray-700">
            {selectedTicket ? (
              <div className="flex flex-col h-full">
                {/* Ticket Header */}
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {selectedTicket.title}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">
                        Status
                      </label>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) =>
                          updateTicketStatus(selectedTicket._id, e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-2">
                        Priority
                      </label>
                      <select
                        value={selectedTicket.priority}
                        onChange={(e) =>
                          updateTicketPriority(selectedTicket._id, e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      {selectedTicket.userId.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-400" />
                      {selectedTicket.category}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                  {selectedTicket.messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 ${
                        msg.senderRole === "user"
                          ? "bg-gray-900 border-gray-600"
                          : "bg-blue-900/30 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white">
                            {msg.sender.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {msg.senderRole}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{msg.message}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex gap-2">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-3 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white placeholder-gray-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={sendingReply || !replyMessage.trim()}
                    className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {sendingReply ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
