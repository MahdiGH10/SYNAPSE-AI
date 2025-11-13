"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Mic, Sparkles, CornerDownLeft, Keyboard, Atom } from "lucide-react";

import { slashCommands } from "@/lib/data";
import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

const ChatComposer = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const suggestions = useWorkspaceStore((state) => state.suggestions);
  const voiceEnabled = useWorkspaceStore((state) => state.voiceEnabled);

  useEffect(() => {
    if (!textareaRef.current) return;
    const element = textareaRef.current;
    element.style.height = "auto";
    const nextHeight = Math.min(element.scrollHeight, 240);
    element.style.height = `${nextHeight}px`;
  }, [value]);

  const trimmed = value.trim();
  const showCommands = value.startsWith("/");

  const inputMode = useMemo(() => {
    if (/```|function|const|class|=>|import /.test(value)) return "syntax";
    if (/story|narrative|concept|vision|copy/.test(value.toLowerCase())) return "creative";
    if (/idea|brainstorm|explore/.test(value.toLowerCase())) return "brainstorm";
    return "default";
  }, [value]);

  const filteredCommands = useMemo(() => {
    if (!showCommands) return slashCommands;
    const query = value.slice(1).toLowerCase();
    return slashCommands.filter((command) =>
      command.command.toLowerCase().includes(query) || command.label.toLowerCase().includes(query),
    );
  }, [value, showCommands]);

  useEffect(() => {
    if (!showCommands) {
      setCommandIndex(0);
    } else if (commandIndex >= filteredCommands.length) {
      setCommandIndex(0);
    }
  }, [showCommands, filteredCommands.length, commandIndex]);

  const handleSubmit = async () => {
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await sendMessage(value);
      setValue("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommands) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCommandIndex((index) => (index + 1) % filteredCommands.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCommandIndex((index) => (index - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const selected = filteredCommands[commandIndex];
        setValue(`${selected.command} `);
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="relative z-20 border-t border-white/10 bg-[rgba(9,13,25,0.75)] px-3 pb-6 pt-4 backdrop-blur-2xl md:px-8">
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
          <span className="flex items-center gap-2 text-white/40">
            <Keyboard className="h-3.5 w-3.5" />
            Type / to open commands
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] text-white/40">
            Enter → send • Shift + Enter → newline
          </span>
          {voiceEnabled && (
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] text-white/50">
              <Mic className="h-3 w-3" /> Listening
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setValue((prev) => `${prev ? `${prev}\n` : ""}${suggestion}`)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.75rem] text-white/60 transition hover:border-white/20 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-panel-soft backdrop-blur-xl">
          <div
            className={`pointer-events-none absolute inset-0 opacity-75 ${
              inputMode === "syntax"
                ? "bg-[radial-gradient(circle_at_0%_0%,rgba(30,144,255,0.32),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(75,0,130,0.26),transparent_55%)]"
                : inputMode === "creative"
                ? "bg-[radial-gradient(circle_at_10%_10%,rgba(255,182,193,0.28),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(173,216,230,0.28),transparent_55%)]"
                : inputMode === "brainstorm"
                ? "bg-[radial-gradient(circle_at_20%_0%,rgba(144,238,144,0.28),transparent_55%),radial-gradient(circle_at_90%_80%,rgba(106,90,205,0.28),transparent_55%)]"
                : "bg-[radial-gradient(circle_at_0%_0%,rgba(91,127,255,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(94,234,212,0.18),transparent_55%)]"
            }`}
          />

          <div className="relative flex flex-col gap-3 px-4 pb-4 pt-4 md:px-6">
            <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.4em] text-white/30">
              <span className="flex items-center gap-2 text-white/40">
                <Atom className="h-3.5 w-3.5" />
                {inputMode === "syntax"
                  ? "Syntax mode"
                  : inputMode === "creative"
                  ? "Creative spectrum"
                  : inputMode === "brainstorm"
                  ? "Multi-idea canvas"
                  : "Adaptive command center"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] text-white/40">
                {isSubmitting ? "Streaming…" : "Ready"}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Detail your mission, brief, or experiment…"
              className="max-h-[240px] min-h-[120px] w-full resize-none bg-transparent text-base leading-7 text-white/80 placeholder:text-white/40 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/50">
                <button className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:text-white" aria-label="Attach file">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className={`rounded-full border p-2 transition ${voiceEnabled ? "border-white/20 bg-gradient-aurora-soft text-white" : "border-white/10 bg-white/5 hover:text-white"}`} aria-label="Voice input">
                  <Mic className="h-4 w-4" />
                </button>
                <button className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:text-white" aria-label="Magic prompt">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => void handleSubmit()}
                disabled={!trimmed || isSubmitting}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-gradient-aurora px-6 py-2 text-sm font-semibold text-white shadow-accent-glow transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CornerDownLeft className="h-4 w-4" />
                Send
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showCommands && filteredCommands.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-0 right-0 mb-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-[rgba(7,11,21,0.95)] p-3 text-sm text-white/80 shadow-[0_20px_60px_rgba(12,20,40,0.5)] backdrop-blur-xl"
              >
                <p className="px-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/30">Slash commands</p>
                <div className="mt-3 space-y-2">
                  {filteredCommands.map((command, index) => {
                    const isActive = index === commandIndex;
                    return (
                      <button
                        key={command.command}
                        onMouseEnter={() => setCommandIndex(index)}
                        onClick={() => setValue(`${command.command} `)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
                          isActive
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/5 bg-white/5 text-white/70 hover:border-white/15 hover:text-white"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{command.label}</span>
                          <span className="block text-xs text-white/50">{command.description}</span>
                        </span>
                        {command.shortcut && (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] text-white/40">
                            {command.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
