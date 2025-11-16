"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Sparkles, Zap, Trash2, Copy, Sun, Moon, MessageSquare, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Nouveau chat',
      messages: [],
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
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const isChatEmpty = activeChat.messages.length === 0;

  /* ---------- Auto-resize textarea ---------- */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  /* ---------- Scroll to bottom on every message change ---------- */
  useEffect(() => {
    inputContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeChat.messages, isTyping]);

  /* ---------- New chat ---------- */
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

  /* ---------- Delete chat ---------- */
  const deleteChat = (id: string) => {
    if (chats.length === 1) return;
    const filtered = chats.filter(c => c.id !== id);
    setChats(filtered);
    if (activeChatId === id) setActiveChatId(filtered[0].id);
  };

  /* ---------- Send message ---------- */
  const handleSend = async () => {
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
    
    const currentInput = input;
    const currentReplyTo = replyTo;
    setInput('');
    setReplyTo(null);
    textareaRef.current?.focus();

    /* Call real API with streaming */
    setIsTyping(true);
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Prepare conversation history
      const conversationHistory = activeChat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
          model: 'synapse-creative',
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      // Create AI message placeholder
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: ''
      };

      setChats(prev => prev.map(c =>
        c.id === activeChatId ? { ...c, messages: [...c.messages, aiMessage] } : c
      ));

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  
                  // Update message in real-time
                  setChats(prev => prev.map(c =>
                    c.id === activeChatId
                      ? {
                          ...c,
                          messages: c.messages.map(m =>
                            m.id === aiMessageId
                              ? { ...m, content: accumulatedContent }
                              : m
                          )
                        }
                      : c
                  ));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Chat API error:', error);
      setIsTyping(false);
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}. Veuillez réessayer.`
      };
      setChats(prev => prev.map(c =>
        c.id === activeChatId ? { ...c, messages: [...c.messages, errorMessage] } : c
      ));
    }
  };

  /* ---------- Copy message ---------- */
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      {/* Animated background */}
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

        {/* Main area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <div className={`h-16 backdrop-blur-2xl ${isDarkMode ? 'bg-gradient-to-r from-[#1a1f2e]/80 to-[#1a1f2e]/50' : 'bg-white/80'} border-b ${isDarkMode ? 'border-white/10' : 'border-blue-200'} flex items-center px-4 md:px-6 shadow-2xl`}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 group"
            >
              <Menu size={22} className="group-hover:rotate-180 transition-transform duration-500 text-cyan-300" />
            </button>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent animate-shimmer ml-3">
              SynapseAI
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                <span className="text-xs font-medium text-cyan-300 hidden md:inline">En ligne</span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Scrollable container: messages + input */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col min-h-full">
              {/* Welcome screen */}
              {isChatEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="space-y-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-shimmer">
                      Sur quoi travaillez-vous ?
                    </h2>
                    <p className="text-lg text-gray-400">
                      Posez une question, collez du code, ou décrivez votre projet.
                    </p>
                  </div>

                  <div className="mt-12 w-full">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
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
                          placeholder="Posez une question..."
                          className={`w-full bg-transparent py-4 px-5 pr-20 ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'} focus:outline-none resize-none transition-all duration-300 scrollbar-thin text-base md:text-lg`}
                          style={{ minHeight: '56px', maxHeight: '160px' }}
                        />
                        <div className="absolute right-3 bottom-3 flex gap-2">
                          
                          <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2.5 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 disabled:scale-100"
                          >
                            <Send size={18} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-3 text-xs text-gray-500">
                      Appuyez sur <kbd className="px-2 py-1 bg-white/10 rounded">Entrée</kbd> pour envoyer
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="space-y-6 flex-1">
                    {activeChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group animate-fade-in`}
                      >
                        <div className={`flex gap-3 max-w-xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${
                            message.role === 'assistant'
                              ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-xl shadow-cyan-400/30'
                              : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'
                          }`}>
                            <span className="text-sm font-bold text-white">
                              {message.role === 'assistant' ? 'S' : 'U'}
                            </span>
                          </div>

                          <div className="flex-1">
                            <div className={`font-bold text-xs mb-1.5 flex items-center gap-2 ${
                              message.role === 'assistant'
                                ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent'
                                : 'text-gray-400'
                            }`}>
                              {message.role === 'assistant' ? 'SynapseAI' : 'Toi'}
                              {message.role === 'assistant' && <Sparkles size={12} className="text-cyan-400 animate-pulse" />}
                            </div>

                            {message.replyTo && (
                              <div className="mb-2 p-2 bg-white/5 rounded-lg text-xs text-gray-400 border-l-4 border-cyan-400">
                                ↳ {activeChat.messages.find(m => m.id === message.replyTo)?.content.slice(0, 80)}...
                              </div>
                            )}

                            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-blue-50'} backdrop-blur-md border ${isDarkMode ? 'border-white/10' : 'border-blue-200'} shadow-sm`}>
                              <div className="prose prose-invert max-w-none text-sm md:text-base">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            </div>

                            <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setReplyTo(message.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-xs">
                                <MessageSquare size={14} />
                              </button>
                              <button onClick={() => copyMessage(message.content)} className="p-1.5 hover:bg-white/10 rounded-lg text-xs">
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-3 max-w-xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-xl animate-pulse flex-shrink-0" />
                          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input – glued to the very bottom */}
                  <div ref={inputContainerRef} className="mt-4">
                    {replyTo && (
                      <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-400/50 rounded-xl text-sm flex justify-between items-center">
                        <span className="truncate">Réponse à : {activeChat.messages.find(m => m.id === replyTo)?.content.slice(0, 50)}...</span>
                        <button onClick={() => setReplyTo(null)} className="text-cyan-400 hover:text-cyan-300 ml-2">X</button>
                      </div>
                    )}
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
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
                          placeholder="Posez une question..."
                          className={`w-full bg-transparent py-4 px-5 pr-20 ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'} focus:outline-none resize-none transition-all duration-300 scrollbar-thin text-base md:text-lg`}
                          style={{ minHeight: '56px', maxHeight: '160px' }}
                        />
                        <div className="absolute right-3 bottom-3 flex gap-2">
                          
                          <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2.5 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 disabled:scale-100"
                          >
                            <Send size={18} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-3 text-xs text-gray-500">
                      <Zap size={14} className="inline text-cyan-400 animate-pulse" /> SynapseAI peut halluciner.
                    </p>
                  </div>
                </>
              )}
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
        .scrollbar-thin { scrollbar-width: thin; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </>
  );
}