"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  ChevronLeft,
  Menu,
  LogOut,
  Search,
  Settings,
  ChevronsUpDown,
} from "lucide-react";
import { chatModels } from "@/lib/data";
import { useChatStore } from "@/store/chatStore";
import { useShallow } from "zustand/react/shallow";

const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -320, opacity: 0 },
};

const conversationVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const Sidebar = () => {
  const {
    conversations,
    activeId,
    newConversation,
    setActive,
    renameConversation,
    deleteConversation,
    toggleSidebar,
    sidebarOpen,
    togglePin,
  } = useChatStore(
    useShallow((state) => ({
      conversations: state.conversations,
      activeId: state.activeId,
      newConversation: state.newConversation,
      setActive: state.setActive,
      renameConversation: state.renameConversation,
      deleteConversation: state.deleteConversation,
      toggleSidebar: state.toggleSidebar,
      sidebarOpen: state.sidebarOpen,
      togglePin: state.togglePin,
    })),
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setDraftTitle(title);
  };

  const commitRename = () => {
    if (editingId) {
      renameConversation(editingId, draftTitle);
      setEditingId(null);
      setDraftTitle("");
    }
  };

  const discardRename = () => {
    setEditingId(null);
    setDraftTitle("");
  };

  const handleConversationClick = (id: string) => {
    setActive(id);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleNewConversation = () => {
    newConversation();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed md:static z-40 top-0 left-0 h-full md:h-auto w-72 md:w-80 shrink-0"
      >
        <div className="flex h-full flex-col gap-6 border-r border-white/10 bg-[rgba(10,14,26,0.85)] backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#5B7FFF] via-[#4F6DFF] to-[#9E62FF] text-white shadow-[0_0_20px_rgba(79,109,255,0.35)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white/80">Assistant Virtuel</span>
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">SynapseAI</span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Search + New conversation */}
          <div className="space-y-3 px-6">
            <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 shadow-panel-soft focus-within:border-white/20">
              <Search className="h-4 w-4 text-white/40 transition group-focus-within:rotate-12" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search missions"
                className="w-full bg-transparent text-sm text-white/70 placeholder:text-white/40 focus:outline-none"
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewConversation}
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-aurora-soft px-4 py-3 text-left text-sm font-semibold text-white/90 shadow-accent-glow transition hover:border-white/20"
            >
              <span>New conversation</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 transition group-hover:bg-white/20 group-hover:text-white">
                <Plus className="h-4 w-4" />
              </span>
            </motion.button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-2 pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {pinned.length > 0 && (
              <div className="space-y-3">
                <div className="px-4 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                  Pinned
                </div>
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {pinned.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        variants={conversationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <button
                          onClick={() => handleConversationClick(conversation.id)}
                          className={`group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                            activeId === conversation.id
                              ? "border-white/20 bg-white/10 shadow-[0_10px_40px_rgba(91,127,255,0.3)]"
                              : "border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10"
                          }`}
                        >
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60">
                            <Pin className="h-4 w-4" />
                          </span>
                          <div className="flex-1 space-y-1">
                            {editingId === conversation.id ? (
                              <input
                                value={draftTitle}
                                autoFocus
                                onChange={(event) => setDraftTitle(event.target.value)}
                                onBlur={commitRename}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") commitRename();
                                  if (event.key === "Escape") discardRename();
                                }}
                                className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-white/30"
                              />
                            ) : (
                              <p className="line-clamp-2 text-sm font-medium text-white/90">
                                {conversation.title}
                              </p>
                            )}
                            <p className="text-xs text-white/50">
                              {chatModels.find((model) => model.id === conversation.model)?.label ?? "Synapse model"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 opacity-0 transition group-hover:opacity-100">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                togglePin(conversation.id);
                              }}
                              className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:text-white"
                              aria-label="Unpin conversation"
                            >
                              <PinOff className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                startEdit(conversation.id, conversation.title);
                              }}
                              className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:text-white"
                              aria-label="Rename conversation"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="px-4 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
                Recent
              </div>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {recent.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      variants={conversationVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <button
                        onClick={() => handleConversationClick(conversation.id)}
                        className={`group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          activeId === conversation.id
                            ? "border-white/20 bg-white/10 shadow-[0_10px_40px_rgba(91,127,255,0.25)]"
                            : "border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10"
                        }`}
                      >
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/50">
                          <Menu className="h-4 w-4" />
                        </span>
                        <div className="flex-1 space-y-1">
                          {editingId === conversation.id ? (
                            <input
                              value={draftTitle}
                              autoFocus
                              onChange={(event) => setDraftTitle(event.target.value)}
                              onBlur={commitRename}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") commitRename();
                                if (event.key === "Escape") discardRename();
                              }}
                              className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-white/30"
                            />
                          ) : (
                            <p className="line-clamp-2 text-sm font-medium text-white/90">
                              {conversation.title}
                            </p>
                          )}
                          <p className="text-xs text-white/50">
                            {chatModels.find((model) => model.id === conversation.model)?.tagline ?? "Adaptive AI"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              togglePin(conversation.id);
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:text-white"
                            aria-label="Pin conversation"
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              startEdit(conversation.id, conversation.title);
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:text-white"
                            aria-label="Rename conversation"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-1 text-white/60 transition hover:text-rose-200"
                            aria-label="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3 px-6 pb-6">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Workspace</p>
                  <p className="font-medium text-white/80">SynapseAI Studio</p>
                </div>
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/40 transition hover:text-white">
                  <ChevronsUpDown className="h-3 w-3" />
                  Switch
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Plan · Neural Explorer</span>
                <span className="rounded-full border border-white/10 bg-gradient-aurora-soft px-3 py-1 text-white/70 shadow-accent-glow">
                  Active
                </span>
              </div>
            </div>
            <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 transition hover:text-white">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Quick settings
              </span>
              <span className="text-xs text-white/40">⌘ ,</span>
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:text-white">
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
          aria-label="Dismiss sidebar"
        />
      )}
    </>
  );
};

export default Sidebar;
