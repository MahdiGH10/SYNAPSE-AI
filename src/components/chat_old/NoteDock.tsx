"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Lightbulb, Target, NotebookPen } from "lucide-react";

import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

const extractNotes = (content: string) => {
  const lines = content.split(/\n|\./).map((line) => line.trim()).filter(Boolean);
  const todos = lines.filter((line) => /todo|action|next/i.test(line)).slice(0, 4);
  const insights = lines.filter((line) => /insight|key|learn/i.test(line)).slice(0, 3);
  const code = lines.filter((line) => /code|function|component|module/i.test(line)).slice(0, 3);
  return { todos, insights, code };
};

const NoteDock = () => {
  const noteDockOpen = useWorkspaceStore((state) => state.noteDockOpen);
  const toggleNoteDock = useWorkspaceStore((state) => state.toggleNoteDock);
  const conversation = useChatStore((state) =>
    state.conversations.find((item) => item.id === state.activeId),
  );

  const digest = useMemo(() => {
    if (!conversation) return null;
    const assistantMessages = conversation.messages
      .filter((message) => message.role === "assistant")
      .map((message) => extractNotes(message.content));

    const todos = assistantMessages.flatMap((message) => message.todos);
    const insights = assistantMessages.flatMap((message) => message.insights);
    const code = assistantMessages.flatMap((message) => message.code);

    return {
      todos: todos.slice(0, 5),
      insights: insights.slice(0, 4),
      code: code.slice(0, 4),
    };
  }, [conversation]);

  return (
    <AnimatePresence>
      {noteDockOpen && (
        <motion.aside
          key="note-dock"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="hidden w-[300px] flex-shrink-0 flex-col gap-4 rounded-3xl border border-white/10 bg-[rgba(11,16,27,0.8)] p-5 shadow-panel backdrop-blur-md lg:flex"
        >
          <header className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
            <span>Smart note dock</span>
            <button
              onClick={toggleNoteDock}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.65rem] text-white/50 transition hover:text-white"
            >
              Hide
            </button>
          </header>

          <div className="space-y-4 text-sm text-white/70">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                <Lightbulb className="h-4 w-4 text-amber-200" />
                Key insights
              </div>
              <ul className="space-y-2 text-[0.85rem]">
                {digest?.insights?.length ? (
                  digest.insights.map((insight, index) => (
                    <li key={`${insight}-${index}`} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                      {insight}
                    </li>
                  ))
                ) : (
                  <li className="rounded-xl border border-dashed border-white/10 bg-white/5 px-3 py-6 text-center text-white/40">
                    Ask SynapseAI for highlights to populate insights.
                  </li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                <Target className="h-4 w-4 text-sky-200" />
                Next actions
              </div>
              <ul className="space-y-2 text-[0.85rem]">
                {digest?.todos?.length ? (
                  digest.todos.map((todo, index) => (
                    <li key={`${todo}-${index}`} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#6A5ACD] to-[#00BFFF]" />
                      {todo}
                    </li>
                  ))
                ) : (
                  <li className="rounded-xl border border-dashed border-white/10 bg-white/5 px-3 py-6 text-center text-white/40">
                    Set TODOs in your next prompt.
                  </li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/40">
                <NotebookPen className="h-4 w-4 text-emerald-200" />
                Code snippets
              </div>
              <ul className="space-y-2 text-[0.85rem]">
                {digest?.code?.length ? (
                  digest.code.map((snippet, index) => (
                    <li key={`${snippet}-${index}`} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-white/60">
                      {snippet}
                    </li>
                  ))
                ) : (
                  <li className="rounded-xl border border-dashed border-white/10 bg-white/5 px-3 py-6 text-center text-white/40">
                    Request code walk-throughs to capture here.
                  </li>
                )}
              </ul>
            </section>
          </div>

          <button
            onClick={() => console.info("Export notes", digest)}
            className="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-gradient-aurora px-4 py-3 text-sm font-medium text-white shadow-accent-glow transition hover:shadow-glow"
          >
            <Download className="h-4 w-4" />
            Export as Markdown
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default NoteDock;
