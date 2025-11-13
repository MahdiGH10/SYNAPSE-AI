"use client";"use client";"use client";



import { useState } from "react";

import { motion } from "framer-motion";

import { PanelLeftClose, MessageSquarePlus, Search } from "lucide-react";import { useState } from "react";import { useState } from "react";

import { useChatStore } from "@/store/chatStore";

import { PanelLeftClose, MessageSquarePlus, Search } from "lucide-react";import Link from "next/link";

interface SidebarProps {

  onCollapse: () => void;import { useChatStore } from "@/store/chatStore";import { AnimatePresence, motion } from "framer-motion";

}

import {

export default function Sidebar({ onCollapse }: SidebarProps) {

  const { conversations, activeId, setActive, newConversation } = useChatStore();interface SidebarProps {  Plus,

  const [searchTerm, setSearchTerm] = useState("");

  onCollapse: () => void;  Sparkles,

  const filteredConversations = conversations.filter((conv) =>

    conv.title.toLowerCase().includes(searchTerm.toLowerCase())}  Pin,

  );

  PinOff,

  return (

    <motion.asideconst Sidebar = ({ onCollapse }: SidebarProps) => {  Pencil,

      initial={{ x: -280, opacity: 0 }}

      animate={{ x: 0, opacity: 1 }}  const { conversations, activeId, setActive, createConversation } = useChatStore();  Trash2,

      exit={{ x: -280, opacity: 0 }}

      transition={{ duration: 0.3, ease: "easeOut" }}  const [searchTerm, setSearchTerm] = useState("");  ChevronLeft,

      className="w-72 flex-shrink-0 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl flex flex-col"

    >  Menu,

      <header className="flex items-center justify-between border-b border-white/10 px-4 py-5">

        <h1 className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">  const filteredConversations = conversations.filter((conv) =>  LogOut,

          SynapseAI

        </h1>    conv.title.toLowerCase().includes(searchTerm.toLowerCase())  Search,

        <button

          onClick={onCollapse}  );  Settings,

          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"

          aria-label="Collapse sidebar"  ChevronsUpDown,

        >

          <PanelLeftClose className="h-4 w-4" />  const pinnedConversations = filteredConversations.filter((conv) => conv.pinned);} from "lucide-react";

        </button>

      </header>  const recentConversations = filteredConversations.filter((conv) => !conv.pinned);import { chatModels } from "@/lib/data";



      <div className="p-3">import { useChatStore } from "@/store/chatStore";

        <button

          onClick={() => newConversation()}  return (import { useShallow } from "zustand/react/shallow";

          className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-cyan-500"

        >    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/50 backdrop-blur-xl">

          <MessageSquarePlus className="h-5 w-5" />

          New Chat      {/* Header */}const sidebarVariants = {

        </button>

      </div>      <header className="flex items-center justify-between border-b border-white/10 px-4 py-5">  open: { x: 0, opacity: 1 },



      <div className="px-3 pb-3">        <h1 className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">  closed: { x: -320, opacity: 0 },

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />          SynapseAI};

          <input

            type="text"        </h1>

            value={searchTerm}

            onChange={(e) => setSearchTerm(e.target.value)}        <buttonconst conversationVariants = {

            placeholder="Search conversations..."

            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:bg-white/10"          onClick={onCollapse}  initial: { opacity: 0, y: 12 },

          />

        </div>          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"  animate: { opacity: 1, y: 0 },

      </div>

          aria-label="Collapse sidebar"  exit: { opacity: 0, y: -12 },

      <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

        {filteredConversations.map((conv) => (        >};

          <motion.button

            key={conv.id}          <PanelLeftClose className="h-4 w-4" />

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}        </button>const Sidebar = () => {

            transition={{ duration: 0.2 }}

            onClick={() => setActive(conv.id)}      </header>  const {

            className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${

              activeId === conv.id    conversations,

                ? "bg-indigo-600/20 text-white shadow-sm"

                : "text-slate-300 hover:bg-white/5 hover:text-white"      {/* New Chat Button */}    activeId,

            }`}

          >      <div className="p-3">    newConversation,

            <div className="truncate font-medium">{conv.title}</div>

            <div className="mt-0.5 truncate text-xs text-slate-500">        <button    setActive,

              {conv.messages.length} messages

            </div>          onClick={createConversation}    renameConversation,

          </motion.button>

        ))}          className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:to-cyan-500"    deleteConversation,



        {filteredConversations.length === 0 && (        >    toggleSidebar,

          <div className="py-8 text-center text-sm text-slate-500">

            {searchTerm ? "No conversations found" : "No conversations yet"}          <MessageSquarePlus className="h-5 w-5" />    sidebarOpen,

          </div>

        )}          New Chat    togglePin,

      </div>

    </motion.aside>        </button>  } = useChatStore(

  );

}      </div>    useShallow((state) => ({


      conversations: state.conversations,

      {/* Search Bar */}      activeId: state.activeId,

      <div className="px-3 pb-3">      newConversation: state.newConversation,

        <div className="relative">      setActive: state.setActive,

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />      renameConversation: state.renameConversation,

          <input      deleteConversation: state.deleteConversation,

            type="text"      toggleSidebar: state.toggleSidebar,

            value={searchTerm}      sidebarOpen: state.sidebarOpen,

            onChange={(e) => setSearchTerm(e.target.value)}      togglePin: state.togglePin,

            placeholder="Search conversations..."    })),

            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:bg-white/10"  );

          />

        </div>  const [editingId, setEditingId] = useState<string | null>(null);

      </div>  const [draftTitle, setDraftTitle] = useState("");

  const [search, setSearch] = useState("");

      {/* Conversation List */}

      <div className="flex-1 overflow-y-auto px-3 pb-3">  const filtered = conversations.filter((conversation) =>

        {pinnedConversations.length > 0 && (    conversation.title.toLowerCase().includes(search.toLowerCase()),

          <div className="mb-4">  );

            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">

              Pinned  const pinned = filtered.filter((c) => c.pinned);

            </h3>  const recent = filtered.filter((c) => !c.pinned);

            {pinnedConversations.map((conv) => (

              <button  const startEdit = (id: string, title: string) => {

                key={conv.id}    setEditingId(id);

                onClick={() => setActive(conv.id)}    setDraftTitle(title);

                className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${  };

                  activeId === conv.id

                    ? "bg-indigo-600/20 text-white shadow-sm"  const commitRename = () => {

                    : "text-slate-300 hover:bg-white/5 hover:text-white"    if (editingId) {

                }`}      renameConversation(editingId, draftTitle);

              >      setEditingId(null);

                <div className="truncate font-medium">{conv.title}</div>      setDraftTitle("");

                <div className="mt-0.5 truncate text-xs text-slate-500">    }

                  {conv.messages.length} messages  };

                </div>

              </button>  const discardRename = () => {

            ))}    setEditingId(null);

          </div>    setDraftTitle("");

        )}  };



        {recentConversations.length > 0 && (  const handleConversationClick = (id: string) => {

          <div>    setActive(id);

            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">    if (typeof window !== "undefined" && window.innerWidth < 768) {

              Recent      toggleSidebar();

            </h3>    }

            {recentConversations.map((conv) => (  };

              <button

                key={conv.id}  const handleNewConversation = () => {

                onClick={() => setActive(conv.id)}    newConversation();

                className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${    if (typeof window !== "undefined" && window.innerWidth < 768) {

                  activeId === conv.id      toggleSidebar();

                    ? "bg-indigo-600/20 text-white shadow-sm"    }

                    : "text-slate-300 hover:bg-white/5 hover:text-white"  };

                }`}

              >  return (

                <div className="truncate font-medium">{conv.title}</div>    <>

                <div className="mt-0.5 truncate text-xs text-slate-500">      <motion.aside

                  {conv.messages.length} messages        initial={false}

                </div>        animate={sidebarOpen ? "open" : "closed"}

              </button>        variants={sidebarVariants}

            ))}        transition={{ type: "spring", stiffness: 260, damping: 30 }}

          </div>        className="fixed md:static z-40 top-0 left-0 h-full md:h-auto w-72 md:w-80 shrink-0"

        )}      >

        <div className="flex h-full flex-col gap-6 border-r border-white/10 bg-[rgba(10,14,26,0.85)] backdrop-blur-2xl">

        {filteredConversations.length === 0 && (          {/* Header */}

          <div className="py-8 text-center text-sm text-slate-500">          <div className="flex items-center justify-between px-6 pt-6">

            {searchTerm ? "No conversations found" : "No conversations yet"}            <Link href="/" className="flex items-center gap-3">

          </div>              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#5B7FFF] via-[#4F6DFF] to-[#9E62FF] text-white shadow-[0_0_20px_rgba(79,109,255,0.35)]">

        )}                <Sparkles className="h-5 w-5" />

      </div>              </span>

    </aside>              <div className="flex flex-col">

  );                <span className="text-base font-semibold text-white/80">Assistant Virtuel</span>

};                <span className="text-xs uppercase tracking-[0.3em] text-white/40">SynapseAI</span>

              </div>

export default Sidebar;            </Link>

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
