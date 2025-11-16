"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Menu, Sparkles, Zap, Trash2, Copy, Sun, Moon, MessageSquare, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSearchParams } from 'next/navigation';
import { tokenManager } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  replyTo?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Bienvenue chez SynapseAI',
      messages: [
        {
          id: 'm1',
          role: 'assistant',
          content: "Hey ! Je suis ton **copilot IA**. Pose-moi une question, colle du code, ou dis-moi ce que tu veux faire !"
        }
      ],
      timestamp: Date.now()
    }
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Handle token from Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      tokenManager.set(token);
      // Remove token from URL
      window.history.replaceState({}, '', '/chat');
    }
  }, [searchParams]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, isTyping]);

  // Nouveau chat
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Nouveau chat',
      messages: [],
      timestamp: Date.now()
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setReplyTo(null);
  };

  // Supprimer chat
  const deleteChat = (id: string) => {
    if (chats.length === 1) return;
    const filtered = chats.filter(c => c.id !== id);
    setChats(filtered);
    if (activeChatId === id) {
      setActiveChatId(filtered[0].id);
    }
  };

  // Envoyer message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      replyTo: replyTo || undefined
    };

    const updatedChats = chats.map(c =>
      c.id === activeChatId
        ? {
            ...c,
            messages: [...c.messages, userMessage],
            title: c.messages.length === 0 ? input.slice(0, 30) + '...' : c.title
          }
        : c
    );
    setChats(updatedChats);
    setInput('');
    setReplyTo(null);

    // Simulation IA
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input, replyTo ? activeChat.messages.find(m => m.id === replyTo)?.content : undefined)
      };
      setChats(prev => prev.map(c =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, aiResponse] }
          : c
      ));
      setIsTyping(false);
    }, 1500);
  };

  // Réponse IA simulée
  const getAIResponse = (userInput: string, replyContext?: string) => {
    const responses = [
      `Super question ! Voici une réponse détaillée sur **${userInput}**.\n\n\`\`\`js\n// Exemple de code\nconsole.log("SynapseAI est génial !");\n\`\`\``,
      "D'accord, analysons ça étape par étape...",
      "Intéressant ! Laisse-moi t'expliquer avec un exemple clair.",
      "Voici une solution optimisée en 3 étapes :\n1. ...\n2. ...\n3. ..."
    ];
    return replyContext
      ? `En réponse à : "${replyContext}"\n\n${responses[Math.floor(Math.random() * responses.length)]}`
      : responses[Math.floor(Math.random() * responses.length)];
  };

  // Copier message
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      {/* Background animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-br from-[#0a0e17] via-[#0f1419] to-[#0a0e17]' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100'} animate-gradient-xy`} />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-10 animate-float"
            style={{
              background: isDarkMode
                ? (i % 2 === 0 ? 'radial-gradient(circle, #06b6d4, transparent)' : 'radial-gradient(circle, #60a5fa, transparent)')
                : (i % 2 === 0 ? 'radial-gradient(circle, #7dd3fc, transparent)' : 'radial-gradient(circle, #93c5fd, transparent)'),
              top: `${15 + i * 18}%`,
              left: i % 2 === 0 ? '5%' : '65%',
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className={`flex h-screen ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} overflow-hidden relative`}>
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-500 ease-out backdrop-blur-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/70'} border-r ${isDarkMode ? 'border-white/10' : 'border-blue-200'} overflow-hidden`}>
          <div className="p-6 space-y-6">
            <button
              onClick={createNewChat}
              className="group w-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 p-px rounded-2xl overflow-hidden shadow-xl hover:shadow-cyan-400/50 transition-all duration-300"
            >
              <div className={`rounded-2xl py-4 px-6 flex items-center justify-center gap-3 ${isDarkMode ? 'bg-[#1a1f2e]/90' : 'bg-white'} group-hover:bg-opacity-80 transition-all`}>
                <Plus size={22} className="group-hover:rotate-90 transition-all duration-300 text-blue-400" />
                <span className="font-bold text-blue-400">NOUVEAU CHAT</span>
              </div>
            </button>

            <div className="space-y-2">
              <div className={`text-xs font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'} uppercase tracking-widest flex items-center gap-2`}>
                <MessageSquare size={14} className="animate-pulse" />
                Conversations
              </div>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`group p-3 rounded-2xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-blue-50 hover:bg-blue-100'} border ${activeChatId === chat.id ? 'border-cyan-400' : isDarkMode ? 'border-white/10' : 'border-blue-200'} backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Bot size={16} className={`${activeChatId === chat.id ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-cyan-300' : ''}`}>
                      {chat.title}
                    </span>
                  </div>
                  {chats.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <div className={`h-16 backdrop-blur-2xl ${isDarkMode ? 'bg-gradient-to-r from-[#1a1f2e]/80 to-[#1a1f2e]/50' : 'bg-white/80'} border-b ${isDarkMode ? 'border-white/10' : 'border-blue-200'} flex items-center px-6 shadow-2xl`}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 group"
            >
              <Menu size={22} className="group-hover:rotate-180 transition-transform duration-500 text-cyan-300" />
            </button>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent animate-shimmer">
              SynapseAI
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                <span className="text-xs font-medium text-cyan-300">En ligne</span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 px-6 py-12">
            <div className="max-w-[800px] mx-auto pb-32">
              {activeChat.messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className="group animate-fade-in"
                  style={{
                    marginTop: index > 0 && activeChat.messages[index - 1].role !== message.role ? '48px' : '32px',
                    marginBottom: '0px'
                  }}
                >
                  <div className="flex gap-6">
                    <div className={`relative w-12 h-12 rounded-3xl flex items-center justify-center overflow-hidden ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-xl shadow-cyan-400/30'
                        : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'
                    }`}>
                      <span className="text-lg font-bold text-white z-10">
                        {message.role === 'assistant' ? 'S' : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold mb-2 text-sm flex items-center justify-between ${
                        message.role === 'assistant'
                          ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent'
                          : 'text-gray-400'
                      }`}>
                        <div className="flex items-center gap-2">
                          {message.role === 'assistant' ? 'SynapseAI' : 'Toi'}
                          {message.role === 'assistant' && <Sparkles size={14} className="text-cyan-400 animate-pulse" />}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setReplyTo(message.id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg"
                            title="Répondre"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1.5 hover:bg-white/10 rounded-lg"
                            title="Copier"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                      {message.replyTo && (
                        <div className="mb-3 p-3 bg-white/5 rounded-xl text-sm text-gray-400 border-l-4 border-cyan-400">
                          ↳ {activeChat.messages.find(m => m.id === message.replyTo)?.content.slice(0, 100)}...
                        </div>
                      )}
                      <div className={`py-6 px-6 rounded-[20px] ${isDarkMode ? 'bg-white/5' : 'bg-blue-50'} backdrop-blur-md border ${isDarkMode ? 'border-white/10' : 'border-blue-200'}`} style={{ boxShadow: isDarkMode ? '0 0 20px rgba(6, 182, 212, 0.08)' : '0 0 10px rgba(59, 130, 246, 0.1)' }}>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-5" style={{ marginTop: '24px' }}>
                  <div className="w-12 h-12 rounded-3xl bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-xl animate-pulse" />
                  <div className="flex-1 py-4 px-5 rounded-[18px] bg-white/5 backdrop-blur-md border border-white/10">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-8 pb-12">
            <div className="max-w-[800px] mx-auto">
              {replyTo && (
                <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-400/50 rounded-xl text-sm flex justify-between">
                  <span>Réponse à : {activeChat.messages.find(m => m.id === replyTo)?.content.slice(0, 50)}...</span>
                  <button onClick={() => setReplyTo(null)} className="text-cyan-400 hover:text-cyan-300">✕</button>
                </div>
              )}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className={`relative ${isDarkMode ? 'bg-[#1a1f2e]/80' : 'bg-white/80'} backdrop-blur-2xl rounded-3xl border ${isDarkMode ? 'border-white/20' : 'border-blue-200'} shadow-2xl`}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Pose ta question..."
                    className={`w-full bg-transparent py-6 px-7 pr-24 ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'} focus:outline-none resize-none transition-all duration-300 scrollbar-thin text-base leading-relaxed`}
                    style={{ minHeight: '64px', maxHeight: '200px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-4 bottom-4 p-3.5 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 disabled:scale-100 group"
                  >
                    <Send size={22} className="text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="text-center mt-5 text-xs font-medium text-gray-500 flex items-center justify-center gap-2">
                <Zap size={14} className="text-cyan-400 animate-pulse" />
                SynapseAI peut halluciner. Vérifie les infos critiques.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%, 100% { background-position: -200% 0; } 50% { background-position: 200% 0; } }
        .animate-gradient-xy { background-size: 400% 400%; animation: gradient-xy 20s ease infinite; }
        .animate-float { animation: float linear infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-shimmer { background-size: 200% 200%; animation: shimmer 3s linear infinite; }
      `}</style>
    </>
  );
}