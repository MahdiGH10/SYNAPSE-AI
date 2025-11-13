"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PanelLeft,
  PanelRight,
  Star,
  StarOff,
  Sparkles,
  Settings2,
  ChevronDown,
  Mic,
  Command,
  Wand2,
  Radar,
  Split,
  Activity,
} from "lucide-react";
import { chatModels } from "@/lib/data";
import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useShallow } from "zustand/react/shallow";

const ChatTopbar = () => {
  const {
    conversations,
    activeId,
    sidebarOpen,
    toggleSidebar,
    togglePin,
    setModelForConversation,
    renameConversation,
  } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      activeId: state.activeId,
      sidebarOpen: state.sidebarOpen,
      toggleSidebar: state.toggleSidebar,
      togglePin: state.togglePin,
      setModelForConversation: state.setModelForConversation,
      renameConversation: state.renameConversation,
    })),
  );

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [conversations, activeId],
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [modelOpen, setModelOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!activeConversation) {
        setDraftTitle("");
        setIsEditingTitle(false);
        setModelOpen(false);
        return;
      }

      setDraftTitle(activeConversation.title);
      setIsEditingTitle(false);
      setModelOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeConversation]);

  const handleRename = () => {
    if (activeConversation) {
      renameConversation(activeConversation.id, draftTitle);
    }
    setIsEditingTitle(false);
  };

  const activeModel = chatModels.find((model) => model.id === activeConversation?.model) ?? chatModels[0];

  const view = useWorkspaceStore((state) => state.view);
  const toggleView = useWorkspaceStore((state) => state.toggleView);
  const splitView = useWorkspaceStore((state) => state.splitView);
  const toggleSplitView = useWorkspaceStore((state) => state.toggleSplitView);
  const toggleAnalytics = useWorkspaceStore((state) => state.toggleAnalytics);
  const voiceEnabled = useWorkspaceStore((state) => state.voiceEnabled);
  const toggleVoice = useWorkspaceStore((state) => state.toggleVoice);
  const mood = useWorkspaceStore((state) => state.mood);

  return (
    <header className="relative z-20 rounded-[2rem] border border-white/5 bg-[rgba(12,17,28,0.85)] px-4 py-4 shadow-panel-soft backdrop-blur-md md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/60 transition hover:text-white md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/40 md:flex">
            <span>Synapse workspace · Mood: {mood}</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                onBlur={handleRename}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleRename();
                  if (event.key === "Escape") setIsEditingTitle(false);
                }}
                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 outline-none focus:border-white/30"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-left text-lg font-semibold text-white/80 transition hover:text-white"
              >
                {activeConversation?.title ?? "Select a conversation"}
              </button>
            )}
            {activeConversation && (
              <button
                onClick={() => togglePin(activeConversation.id)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition hover:text-white"
                aria-label={activeConversation.pinned ? "Unpin conversation" : "Pin conversation"}
              >
                {activeConversation.pinned ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModelOpen((prev) => !prev)}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-white/70 transition hover:text-white"
            aria-expanded={modelOpen}
          >
            <span className="rounded-xl bg-gradient-to-r from-[rgba(91,127,255,0.35)] via-[rgba(79,109,255,0.35)] to-[rgba(158,98,255,0.35)] p-2 text-blue-200">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.35em] text-white/30">
                Model
              </span>
              <span className="block font-semibold text-white/80">
                {activeModel.label}
              </span>
            </span>
            <ChevronDown className={`h-4 w-4 transition ${modelOpen ? "rotate-180" : ""}`} />
          </motion.button>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/40 transition hover:text-white/70">
              <div className="flex items-center gap-2 text-[0.7rem]">
                <Command className="h-3.5 w-3.5" />
                Slash commands
              </div>
            </button>
            <button
              onClick={toggleVoice}
              className={`rounded-2xl border px-3 py-2 text-xs uppercase tracking-[0.35em] transition ${
                voiceEnabled
                  ? "border-white/20 bg-gradient-aurora-soft text-white"
                  : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              <div className="flex items-center gap-2 text-[0.7rem]">
                <Mic className="h-3.5 w-3.5" />
                Voice
              </div>
            </button>
            <button className="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/40 transition hover:text-white/70 lg:flex">
              <div className="flex items-center gap-2 text-[0.7rem]">
                <Wand2 className="h-3.5 w-3.5" />
                Automations
              </div>
            </button>
            <button
              onClick={toggleAnalytics}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/40 transition hover:text-white/70"
            >
              <div className="flex items-center gap-2 text-[0.7rem]">
                <Activity className="h-3.5 w-3.5" />
                Analytics
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleView}
                className={`rounded-2xl border px-3 py-2 text-xs uppercase tracking-[0.35em] transition ${
                  view === "mindmap"
                    ? "border-white/20 bg-gradient-aurora-soft text-white"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                <div className="flex items-center gap-2 text-[0.7rem]">
                  <Radar className="h-3.5 w-3.5" />
                  {view === "mindmap" ? "Mindmap" : "Dialogue"}
                </div>
              </button>
              <button
                onClick={toggleSplitView}
                className={`rounded-2xl border px-3 py-2 text-xs uppercase tracking-[0.35em] transition ${
                  splitView
                    ? "border-white/20 bg-gradient-aurora-soft text-white"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
                }`}
              >
                <div className="flex items-center gap-2 text-[0.7rem]">
                  <Split className="h-3.5 w-3.5" />
                  Split view
                </div>
              </button>
            </div>
            <button className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/60 transition hover:text-white">
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {modelOpen && activeConversation && (
        <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-[rgba(8,14,24,0.92)] px-4 py-4 md:px-6">
          <div className="grid gap-3 md:grid-cols-3">
            {chatModels.map((model) => {
              const isActive = model.id === activeConversation.model;
              return (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setModelForConversation(activeConversation.id, model.id);
                    setModelOpen(false);
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex h-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-white/20 bg-gradient-aurora-soft text-white shadow-accent-glow"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{model.label}</span>
                    {isActive && (
                      <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[0.65rem] text-white/70">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50">{model.tagline}</p>
                  <p className="text-xs text-white/40">{model.description}</p>
                  <span className="text-[0.65rem] text-white/30">{model.tokens}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default ChatTopbar;
