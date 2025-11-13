"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { PanelLeftOpen, Sparkles, XCircle, Split } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { chatModels } from "@/lib/data";
import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

import ChatBubble from "./ChatBubble";
import MindmapCanvas from "./MindmapCanvas";
import TypingIndicator from "./TypingIndicator";

const ChatMessages = () => {
  const { conversations, activeId, toggleSidebar } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      activeId: state.activeId,
      toggleSidebar: state.toggleSidebar,
    })),
  );

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [conversations, activeId],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const view = useWorkspaceStore((state) => state.view);
  const splitView = useWorkspaceStore((state) => state.splitView);
  const comparisonPanel = useWorkspaceStore((state) => state.comparisonPanel);
  const closeComparison = useWorkspaceStore((state) => state.closeComparison);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeConversation?.messages.length, view]);

  if (!activeConversation) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#0A0E1A] via-[#0F172A] to-[#0A0E1A] p-8 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <Sparkles className="mx-auto h-10 w-10 text-blue-300" />
          <h2 className="mt-4 text-2xl font-semibold text-white/80">Start a conversation</h2>
          <p className="mt-2 max-w-md text-sm text-white/60">
            Create your first thread, pin important chats, and access SynapseAI models optimised for every workflow.
          </p>
        </div>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:text-white"
        >
          <PanelLeftOpen className="h-4 w-4" />
          Open sidebar
        </button>
      </section>
    );
  }

  const modelMeta = chatModels.find((model) => model.id === activeConversation.model);
  const isStreaming = activeConversation.messages.some((message) => message.status === "streaming");

  if (view === "mindmap") {
    return (
      <section className="relative flex flex-1 flex-col gap-4 p-4">
        <MindmapCanvas messages={activeConversation.messages} />
      </section>
    );
  }

  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{
        backgroundImage:
          "radial-gradient(circle at 18% 22%, rgba(106,90,205,0.18), transparent 45%), radial-gradient(circle at 80% 35%, rgba(0,191,255,0.12), transparent 40%), radial-gradient(circle at 50% 80%, rgba(94,234,212,0.1), transparent 40%)",
        filter: "blur(0px)",
      }} />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.05)_0%,rgba(59,130,246,0.03)_50%,rgba(15,23,42,0.18)_100%)]" />

      <div className="relative z-10 flex h-full flex-col lg:flex-row">
        <div
          ref={containerRef}
          className={`flex-1 overflow-y-auto px-6 pb-8 pt-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 ${
            splitView ? "lg:border-r lg:border-white/5" : ""
          }`}
        >
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/5 bg-white/5 px-6 py-4 text-xs text-white/50 shadow-panel backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/30">Model</p>
                <p className="text-sm font-medium text-white/80">{modelMeta?.label ?? "Synapse model"}</p>
              </div>
              <p className="max-w-xs text-right text-[0.7rem] text-white/40">
                {modelMeta?.description ?? "Adaptive AI tuned for calm, accurate dialogue."}
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-6">
            <AnimatePresence initial={false}>
              {activeConversation.messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  conversationId={activeConversation.id}
                  message={message}
                />
              ))}
            </AnimatePresence>

            {isStreaming && <TypingIndicator />}
          </div>
        </div>

        {splitView && (
          <aside className="hidden w-full max-w-sm flex-shrink-0 flex-col justify-between border-t border-white/5 bg-[rgba(8,12,24,0.85)] p-6 text-sm text-white/70 shadow-panel-soft backdrop-blur-md lg:flex lg:border-t-0 lg:border-l">
            <header className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
              <span>Comparison panel</span>
              <button
                onClick={closeComparison}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.65rem] text-white/60 transition hover:text-white"
              >
                Close
              </button>
            </header>
            {comparisonPanel ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/35">Focus</p>
                  <p className="mt-2 text-sm font-semibold text-white/80">{comparisonPanel.headline}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[0.9rem] leading-7 text-white/70">
                  {comparisonPanel.altResponse}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-white/40">
                <Split className="h-6 w-6" />
                Drag a message to compare alternative drafts here.
              </div>
            )}
            <button
              onClick={closeComparison}
              className="mt-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/50 transition hover:text-white"
            >
              <XCircle className="h-4 w-4" />
              Collapse panel
            </button>
          </aside>
        )}
      </div>
    </section>
  );
};

export default ChatMessages;
