"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MessageSquare, TrendingUp, Brain } from "lucide-react";

import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

const AnalyticsOverlay = () => {
  const analyticsOpen = useWorkspaceStore((state) => state.analyticsOpen);
  const toggleAnalytics = useWorkspaceStore((state) => state.toggleAnalytics);
  const conversations = useChatStore((state) => state.conversations);

  const totalMessages = conversations.reduce((acc, conversation) => acc + conversation.messages.length, 0);
  const totalAssistantMessages = conversations.reduce(
    (acc, conversation) => acc + conversation.messages.filter((message) => message.role === "assistant").length,
    0,
  );
  const totalUserMessages = totalMessages - totalAssistantMessages;
  const totalCharacters = conversations.reduce(
    (acc, conversation) =>
      acc +
      conversation.messages.reduce((sum, message) => sum + message.content.length, 0),
    0,
  );
  const averageLength = totalMessages === 0 ? 0 : Math.round(totalCharacters / totalMessages);

  const recentActivity = conversations.slice(0, 4).map((conversation) => ({
    title: conversation.title,
    updatedAt: conversation.lastUpdated,
    count: conversation.messages.length,
  }));

  return (
    <AnimatePresence>
      {analyticsOpen && (
        <motion.div
          key="analytics-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[rgba(13,18,28,0.92)] p-8 text-sm text-white/70 shadow-panel backdrop-blur-md"
          >
            <header className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">Learning analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">SynapseAI activity pulse</h2>
              </div>
              <button
                onClick={toggleAnalytics}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
              >
                Close
              </button>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                  <span>Sessions</span>
                  <Calendar className="h-4 w-4 text-white/50" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{conversations.length}</p>
                <p className="text-xs text-white/50">Workspace conversations created</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                  <span>Messages</span>
                  <MessageSquare className="h-4 w-4 text-white/50" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{totalMessages}</p>
                <p className="text-xs text-white/50">{totalAssistantMessages} AI · {totalUserMessages} You</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                  <span>Focus ratio</span>
                  <Brain className="h-4 w-4 text-white/50" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{Math.min(100, Math.round((totalAssistantMessages / Math.max(totalMessages, 1)) * 120))}%</p>
                <p className="text-xs text-white/50">AI assists vs. self-driven notes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                  <span>Avg length</span>
                  <MessageSquare className="h-4 w-4 text-white/50" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{averageLength}</p>
                <p className="text-xs text-white/50">Characters per exchange</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/40">
                <TrendingUp className="h-4 w-4" />
                Recently explored missions
              </div>
              <div className="space-y-3 text-sm">
                {recentActivity.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <div>
                      <p className="font-medium text-white/80">{item.title}</p>
                      <p className="text-xs text-white/50">
                        {new Date(item.updatedAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                      {item.count} exchanges
                    </span>
                  </div>
                ))}
                {!recentActivity.length && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-white/40">
                    Start a conversation to view activity insights.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsOverlay;
