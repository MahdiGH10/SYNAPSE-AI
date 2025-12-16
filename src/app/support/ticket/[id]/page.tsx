"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Shield,
} from "lucide-react";
import { tokenManager } from "@/lib/api";

interface Message {
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

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  messages: Message[];
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/tickets/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
      } else {
        console.error("Failed to fetch ticket");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/tickets/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchTicket();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-5 h-5" />;
      case "in-progress":
        return <Clock className="w-5 h-5" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5" />;
      case "closed":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-white text-xl mb-4">Ticket not found</p>
        <button
          onClick={() => router.push("/support")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Support
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push("/support")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Support
          </button>
        </motion.div>

        {/* Ticket Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {ticket.title}
              </h1>
              <p className="text-gray-400 mb-4">{ticket.description}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace("-", " ")}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                  {ticket.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-700 pt-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {ticket.userId.name}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Created {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Conversation</h2>
            <p className="text-sm text-gray-400 mt-1">
              {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Messages */}
          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {ticket.messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              ticket.messages.map((msg, idx) => {
                const isAdmin = msg.senderRole === "admin" || msg.senderRole === "superadmin";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isAdmin ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${
                        isAdmin
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isAdmin ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span className="font-semibold text-sm">
                          {msg.sender.name} {isAdmin && "(Admin)"}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{msg.message}</p>
                      <p className="text-xs opacity-70">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-6 border-t border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending || ticket.status === "closed"}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={sending || !newMessage.trim() || ticket.status === "closed"}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send
                  </>
                )}
              </motion.button>
            </div>
            {ticket.status === "closed" && (
              <p className="text-sm text-gray-400 mt-2">
                This ticket is closed. No more messages can be sent.
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
