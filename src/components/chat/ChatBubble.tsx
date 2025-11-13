"use client";"use client";



import { motion } from "framer-motion";import { useMemo, useState, type ReactNode } from "react";

import ReactMarkdown from "react-markdown";import { motion } from "framer-motion";

import remarkGfm from "remark-gfm";import ReactMarkdown from "react-markdown";

import { type Message } from "@/store/chatStore";import type { Components } from "react-markdown";

import { Bot, User } from "lucide-react";import { Bot, User, Copy, Check, RefreshCcw, ThumbsUp, ThumbsDown, SplitSquareHorizontal } from "lucide-react";

import { useChatStore, type Message, type MessageReaction } from "@/store/chatStore";

interface ChatBubbleProps {import { useShallow } from "zustand/react/shallow";

  message: Message;import { useWorkspaceStore } from "@/store/workspaceStore";

}

interface ChatBubbleProps {

export default function ChatBubble({ message }: ChatBubbleProps) {  conversationId: string;

  const isUser = message.role === "user";  message: Message;

}

  return (

    <motion.divconst bubbleVariants = {

      initial={{ opacity: 0, y: 20 }}  initial: { opacity: 0, y: 16 },

      animate={{ opacity: 1, y: 0 }}  animate: { opacity: 1, y: 0 },

      transition={{ duration: 0.3, ease: "easeOut" }}};

      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}

    >const buildComparisonSynopsis = (content: string) => {

      {!isUser && (  const trimmed = content.trim();

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">  if (!trimmed) return { headline: "Fresh angle", alt: "Request another draft to compare perspectives." };

          <Bot className="h-5 w-5 text-white" />  const headline = trimmed.split("\n")[0].slice(0, 90);

        </div>  const alt = `Alternate synthesis:\n• Reframe key insight\n• Surface contrast scenario\n• Suggest one bolder leap\n\n${trimmed.length > 140 ? trimmed.slice(0, 140) + "…" : trimmed}`;

      )}  return { headline, alt };

};

      <div

        className={`max-w-2xl rounded-2xl px-5 py-3 ${const ChatBubble = ({ conversationId, message }: ChatBubbleProps) => {

          isUser  const isAssistant = message.role === "assistant";

            ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg"  const [copied, setCopied] = useState(false);

            : "bg-slate-800/50 text-slate-100 border border-white/10 backdrop-blur-sm"  const [hovered, setHovered] = useState(false);

        }`}

      >  const { regenerateResponse, reactToMessage } = useChatStore(

        {isUser ? (    useShallow((state) => ({

          <p className="whitespace-pre-wrap">{message.content}</p>      regenerateResponse: state.regenerateResponse,

        ) : (      reactToMessage: state.reactToMessage,

          <div className="prose prose-invert prose-sm max-w-none">    })),

            <ReactMarkdown  );

              remarkPlugins={[remarkGfm]}

              components={{  const openComparison = useWorkspaceStore((state) => state.openComparison);

                code: ({ inline, children, ...props }: any) => (

                  inline ? (  const comparisonPayload = useMemo(() => buildComparisonSynopsis(message.content), [message.content]);

                    <code className="rounded bg-slate-700/50 px-1.5 py-0.5 text-sm text-cyan-300" {...props}>

                      {children}  const handleCopy = async () => {

                    </code>    try {

                  ) : (      await navigator.clipboard.writeText(message.content);

                    <pre className="rounded-lg bg-slate-900/50 p-4 overflow-x-auto border border-white/10">      setCopied(true);

                      <code className="text-sm text-slate-200" {...props}>{children}</code>      setTimeout(() => setCopied(false), 2200);

                    </pre>    } catch (error) {

                  )      console.error("Clipboard copy failed", error);

                ),    }

              }}  };

            >

              {message.content}  const handleReaction = (reaction: MessageReaction) => {

            </ReactMarkdown>    reactToMessage(conversationId, message.id, reaction);

          </div>  };

        )}

  const markdownComponents: Components = {

        {message.status === "streaming" && (    code: (props) => {

          <motion.div      const { inline, children } = props as { inline?: boolean; children: ReactNode };

            className="mt-2 flex items-center gap-1"      if (inline) {

            initial={{ opacity: 0 }}        return (

            animate={{ opacity: 1 }}          <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-[0.85em] text-white">

          >            {children}

            <motion.div          </code>

              className="h-2 w-2 rounded-full bg-cyan-400"        );

              animate={{ scale: [1, 1.2, 1] }}      }

              transition={{ duration: 1, repeat: Infinity }}      return (

            />        <pre className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[0.85rem]">

            <motion.div          <code>{children}</code>

              className="h-2 w-2 rounded-full bg-cyan-400"        </pre>

              animate={{ scale: [1, 1.2, 1] }}      );

              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}    },

            />  };

            <motion.div

              className="h-2 w-2 rounded-full bg-cyan-400"  return (

              animate={{ scale: [1, 1.2, 1] }}    <motion.article

              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}      layout

            />      variants={bubbleVariants}

          </motion.div>      initial="initial"

        )}      animate="animate"

      </div>      transition={{ duration: 0.2, ease: "easeOut" }}

      onMouseEnter={() => setHovered(true)}

      {isUser && (      onMouseLeave={() => setHovered(false)}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">      className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}

          <User className="h-5 w-5 text-white" />    >

        </div>      <div

      )}        className={`relative flex w-full max-w-3xl gap-4 ${

    </motion.div>          isAssistant ? "flex-row" : "flex-row-reverse"

  );        }`}

}      >

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-lg ${
            isAssistant
              ? "bg-gradient-to-br from-[rgba(91,127,255,0.2)] to-[rgba(158,98,255,0.15)] text-[#E0E7FF]"
              : "bg-gradient-to-br from-[rgba(33,152,246,0.4)] to-[rgba(91,127,255,0.35)] text-white"
          }`}
        >
          {isAssistant ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </div>

        <div
          className={`group relative flex-1 rounded-3xl border border-white/10 px-6 pb-4 pt-5 text-sm leading-7 shadow-[0_30px_80px_rgba(12,20,40,0.45)] backdrop-blur-xl transition ${
            isAssistant
              ? "bg-[rgba(15,23,42,0.75)]"
              : "bg-gradient-to-br from-[rgba(59,130,246,0.65)] via-[rgba(91,127,255,0.6)] to-[rgba(94,234,212,0.45)] text-white"
          }`}
        >
          <div
            className={`prose prose-invert max-w-none text-[0.95rem] leading-7 ${
              isAssistant ? "text-white/80" : "text-white"
            }`}
          >
            <ReactMarkdown components={markdownComponents}>
              {message.content || (message.status === "streaming" ? "" : "…")}
            </ReactMarkdown>
          </div>

          <div className="mt-3 flex items-center justify-between text-[0.75rem] text-white/40">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {isAssistant && message.status === "streaming" && (
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-blue-200/60">
                <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300" />
                Typing
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-none absolute -top-4 ${
              isAssistant ? "left-5" : "right-5"
            } flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[0.75rem] text-white/60 shadow-xl backdrop-blur-md`}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleCopy();
              }}
              disabled={!message.content}
              className="pointer-events-auto rounded-full p-1.5 transition hover:text-white"
              aria-label="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {isAssistant && message.status === "complete" && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  regenerateResponse(conversationId, message.id);
                }}
                className="pointer-events-auto rounded-full p-1.5 transition hover:text-white"
                aria-label="Regenerate response"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </button>
            )}

            {isAssistant && (
              <div className="pointer-events-auto flex items-center gap-1">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReaction("like");
                  }}
                  className={`rounded-full p-1.5 transition hover:text-white ${
                    message.reaction === "like" ? "text-blue-300" : ""
                  }`}
                  aria-label="Like response"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleReaction("dislike");
                  }}
                  className={`rounded-full p-1.5 transition hover:text-white ${
                    message.reaction === "dislike" ? "text-rose-300" : ""
                  }`}
                  aria-label="Dislike response"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openComparison({
                      messageId: message.id,
                      headline: comparisonPayload.headline,
                      altResponse: comparisonPayload.alt,
                    });
                  }}
                  className="rounded-full p-1.5 transition hover:text-white"
                  aria-label="Open comparison panel"
                >
                  <SplitSquareHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default ChatBubble;
