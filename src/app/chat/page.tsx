"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Sparkles, Zap, Trash2, Copy, Sun, Moon, MessageSquare, Bot, Upload, FileText, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageRenderer from '@/components/chat/MessageRenderer';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  replyTo?: string;
  attachments?: Array<{
    name: string;
    category: string;
    size: string;
  }>;
  sources?: Array<{
    doc_name: string;
    category: string;
    similarity: number;
    preview: string;
  }>;
}

interface UploadedDoc {
  name: string;
  category: string;
  confidence: number;
  text?: string; // Store document text for context
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); // Track active streaming
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Streaming optimization - use ref to avoid re-renders during streaming
  const streamingContentRef = useRef<string>('');
  const streamingMessageIdRef = useRef<string>('');
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const activeChat = chats.find(c => c.id === activeChatId);
  const isChatEmpty = !activeChat || activeChat.messages.length === 0;

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  /* ---------- Drag and drop handlers ---------- */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0]; // Handle first file
      await processFileUpload(file);
    }
  };

  /* ---------- Process file upload ---------- */
  const processFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const category = data.data?.classification?.category || data.classification?.category || 'Document';
        const confidence = data.data?.classification?.confidence || data.classification?.confidence || 0;
        const extractedText = data.data?.text || '';
        const wordCount = data.data?.wordCount || 0;
        const pageCount = data.data?.pages || 0;
        
        setUploadedDocs(prev => [...prev, {
          name: file.name,
          category: category,
          confidence: confidence,
          text: extractedText
        }]);
      } else {
        console.error('Upload failed:', data.error);
        alert(`Upload failed: ${data.error || 'Unknown error'}\n${data.message || ''}`);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Upload error: ${error.message || 'Network or server error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------- Load user's chats from database on mount ---------- */
  useEffect(() => {
    const loadUserChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If not logged in, create a default new chat
          const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New chat',
            messages: [],
            timestamp: Date.now()
          };
          setChats([newChat]);
          setActiveChatId(newChat.id);
          setIsLoadingChats(false);
          return;
        }

        // Load chats from database
        const response = await fetch('/api/chats/save', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Convert database chats to UI format
          const loadedChats = data.data.map((chat: any) => ({
            id: chat.chatId,
            title: chat.title,
            messages: [], // Load messages on demand
            timestamp: new Date(chat.updatedAt).getTime(),
          }));
          
          // Add "New chat" option at the beginning
          const newChatOption: Chat = {
            id: 'new-' + Date.now(),
            title: 'New chat',
            messages: [],
            timestamp: Date.now()
          };
          
          const allChats = [newChatOption, ...loadedChats];
          setChats(allChats);
          
          // Load the most recent chat (first in loadedChats)
          const mostRecentChat = loadedChats[0];
          setActiveChatId(mostRecentChat.id);
          
          // Load its messages
          const chatResponse = await fetch(`/api/chats/${mostRecentChat.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const chatData = await chatResponse.json();
          
          if (chatData.success) {
            setChats(prev => prev.map(c => 
              c.id === mostRecentChat.id 
                ? { ...c, messages: chatData.data.messages }
                : c
            ));
          }
        } else {
          // No saved chats, create a new one
          const newChat: Chat = {
            id: Date.now().toString(),
            title: 'New chat',
            messages: [],
            timestamp: Date.now()
          };
          setChats([newChat]);
          setActiveChatId(newChat.id);
        }
        
        setIsLoadingChats(false);
      } catch (error) {
        console.error('Failed to load chats:', error);
        // On error, create a default chat
        const newChat: Chat = {
          id: Date.now().toString(),
          title: 'New chat',
          messages: [],
          timestamp: Date.now()
        };
        setChats([newChat]);
        setActiveChatId(newChat.id);
        setIsLoadingChats(false);
      }
    };

    const loadDocs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/rag/upload', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.documents) {
          setUploadedDocs(data.documents.map((doc: any) => ({
            name: doc.doc_name,
            category: doc.category,
            confidence: doc.confidence
          })));
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      }
    };

    loadUserChats();
    loadDocs();
  }, []);

  /* ---------- Auto-resize textarea ---------- */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  /* ---------- Detect user scroll (ChatGPT-style) ---------- */
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsUserScrolling(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- Auto-scroll to bottom on new messages (ChatGPT-style) ---------- */
  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    if (messagesEndRef.current && !isUserScrolling && (isStreaming || isTyping || activeChat?.messages.length)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [activeChat?.messages.length, isTyping, isStreaming, isUserScrolling]);

  /* ---------- New chat ---------- */
  const createNewChat = () => {
    const newChat: Chat = {
      id: 'new-' + Date.now().toString(),
      title: 'New chat',
      messages: [],
      timestamp: Date.now()
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setReplyTo(null);
  };

  /* ---------- Delete chat ---------- */
  const deleteChat = async (id: string) => {
    if (chats.length <= 1) return;
    
    try {
      const token = localStorage.getItem('token');
      if (token && !id.startsWith('new-')) {
        // Delete from database (only if it's a saved chat)
        await fetch(`/api/chats/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Failed to delete chat from database:', error);
    }
    
    const filtered = chats.filter(c => c.id !== id);
    if (filtered.length === 0) {
      // Create a new chat if we deleted the last one
      const newChat: Chat = {
        id: 'new-' + Date.now().toString(),
        title: 'New chat',
        messages: [],
        timestamp: Date.now()
      };
      setChats([newChat]);
      setActiveChatId(newChat.id);
    } else {
      setChats(filtered);
      if (activeChatId === id) {
        setActiveChatId(filtered[0].id);
        // Load messages if needed
        if (filtered[0].messages.length === 0 && !filtered[0].id.startsWith('new-')) {
          loadChatMessages(filtered[0].id);
        }
      }
    }
  };

  /* ---------- Load specific chat messages ---------- */
  const loadChatMessages = async (chatId: string) => {
    // Skip loading for new chats
    if (chatId.startsWith('new-')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/chats/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        // Update the chat with full messages
        setChats(prev => prev.map(c => 
          c.id === chatId 
            ? { ...c, messages: data.data.messages, title: data.data.title }
            : c
        ));
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  /* ---------- Save chat to database ---------- */
  const saveChat = async (chat: Chat) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Don't save empty chats
      if (chat.messages.length === 0) return;
      
      // Generate a proper ID if it's a new chat
      let chatId = chat.id;
      if (chatId.startsWith('new-')) {
        chatId = Date.now().toString();
        // Update the chat ID in state
        setChats(prev => prev.map(c => 
          c.id === chat.id ? { ...c, id: chatId } : c
        ));
        if (activeChatId === chat.id) {
          setActiveChatId(chatId);
        }
      }

      await fetch('/api/chats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: chatId,
          title: chat.title,
          messages: chat.messages,
        }),
      });
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  /* ---------- Auto-save when chat changes ---------- */
  useEffect(() => {
    if (activeChat && activeChat.messages.length > 0 && !isLoadingChats && !isStreaming) {
      // Debounce saving to avoid too many requests
      const timer = setTimeout(() => {
        saveChat(activeChat);
      }, 2000); // Save 2 seconds after last change

      return () => clearTimeout(timer);
    }
  }, [activeChat?.messages.length, isLoadingChats, isStreaming]);

  /* ---------- Upload document ---------- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  /* ---------- Send message ---------- */
  const handleSend = async () => {
    if (!input.trim()) return;

    // Reset scroll state when sending a new message
    setIsUserScrolling(false);

    // Capture documents before clearing
    const docsToAttach = [...uploadedDocs];

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      replyTo: replyTo || undefined,
      ...(docsToAttach.length > 0 && {
        attachments: docsToAttach.map(doc => ({
          name: doc.name,
          category: doc.category,
          size: doc.text ? `${Math.round(doc.text.length / 1024)}KB` : 'N/A'
        }))
      })
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
    setUploadedDocs([]); // Clear document indicator - files now shown in message bubble
    textareaRef.current?.focus();

    /* Call real API with streaming */
    setIsTyping(true);
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Prepare message (with or without document context)
      let messageToSend = currentInput;
      
      if (docsToAttach.length > 0 && docsToAttach.some(doc => doc.text)) {
        // Add document context if documents are uploaded
        const documentContext = docsToAttach
          .filter(doc => doc.text)
          .map(doc => `[Document: ${doc.name}]\n${doc.text}`)
          .join('\n\n---\n\n');
        
        messageToSend = `Context: The user has uploaded the following documents:\n\n${documentContext}\n\n---\n\nUser Question: ${currentInput}\n\nPlease answer based on the documents provided above. If the answer is not in the documents, say so clearly.`;
      }
      
      // Prepare conversation history
      const conversationHistory = activeChat?.messages.filter(m => m.role !== 'system').map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];

      // Call streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageToSend,
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

      // Create AI message placeholder
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: ''
      };

      // Reset streaming refs
      streamingContentRef.current = '';
      streamingMessageIdRef.current = aiMessageId;

      setChats(prev => prev.map(c =>
        c.id === activeChatId ? { ...c, messages: [...c.messages, aiMessage] } : c
      ));

      // Smooth update function - updates UI every 16ms (~60fps) for fluid streaming
      const updateStreamingMessage = () => {
        const content = streamingContentRef.current;
        const messageId = streamingMessageIdRef.current;
        
        setChats(prev => prev.map(c =>
          c.id === activeChatId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === messageId
                    ? { ...m, content }
                    : m
                )
              }
            : c
        ));
        
        // Smooth scroll to bottom during streaming
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      };

      setIsStreaming(true); // Start streaming visual indicator

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
                  // Accumulate in ref (no re-render)
                  streamingContentRef.current += parsed.content;
                  
                  // Clear existing timeout
                  if (streamingTimeoutRef.current) {
                    clearTimeout(streamingTimeoutRef.current);
                  }
                  
                  // Schedule smooth update (16ms = ~60fps for fluid animation)
                  streamingTimeoutRef.current = setTimeout(() => {
                    updateStreamingMessage();
                  }, 16);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
        
        // Final update after stream completes
        if (streamingTimeoutRef.current) {
          clearTimeout(streamingTimeoutRef.current);
        }
        updateStreamingMessage();
      }

      setIsTyping(false);
      setIsStreaming(false); // Stop streaming indicator
      
      // Clear document indicator after response completes
      setUploadedDocs([]);
    } catch (error) {
      console.error('Chat API error:', error);
      setIsTyping(false);
      setIsStreaming(false); // Stop streaming on error
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'An error occurred'}. Please try again.`
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

  // Show loading state while chats are loading
  if (isLoadingChats) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0a0f1e]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your chats...</p>
        </div>
      </div>
    );
  }

  // If no active chat, show error
  if (!activeChat) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0a0f1e]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className="text-red-400">Error loading chat. Please refresh the page.</p>
        </div>
      </div>
    );
  }

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
                <span className="font-bold text-blue-400">NEW CHAT</span>
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
                  onClick={() => {
                    setActiveChatId(chat.id);
                    // Load messages if this chat doesn't have them loaded yet
                    if (chat.messages.length === 0 && !chat.id.startsWith('new-')) {
                      loadChatMessages(chat.id);
                    }
                  }}
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
                <span className="text-xs font-medium text-cyan-300 hidden md:inline">Online</span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Main content area - split into messages and fixed input */}
          {isChatEmpty ? (
            /* Welcome screen with embedded input */
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="h-full flex flex-col">
                {/* Welcome screen */}
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-2xl shadow-cyan-400/30 mb-6">
                        <Sparkles size={32} className="text-white animate-pulse" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        How can I help you?
                      </h2>
                      <p className="text-lg text-gray-400">
                        Ask a question, share code, or describe your project.
                      </p>
                    </div>

                    {/* Drag and drop overlay */}
                    {isDragging && (
                      <div className="absolute inset-0 z-50 bg-cyan-500/20 backdrop-blur-sm border-4 border-dashed border-cyan-400 rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                          <Upload size={64} className="mx-auto mb-4 text-cyan-400 animate-bounce" />
                          <p className="text-2xl font-bold text-white">Drop your file here</p>
                          <p className="text-gray-300 mt-2">PDF, DOCX, TXT, CSV supported</p>
                        </div>
                      </div>
                    )}

                    {/* Compact document indicator - ChatGPT style */}
                    {uploadedDocs.length > 0 && (
                      <div className={`mb-3 px-3 py-2 rounded-lg flex items-center gap-2 text-sm w-fit ${
                        isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <FileText size={14} className="text-blue-500 flex-shrink-0" />
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {uploadedDocs.length} {uploadedDocs.length > 1 ? 'files' : 'file'}
                          </span>
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {uploadedDocs.map(d => d.name).join(', ').substring(0, 50)}{uploadedDocs.map(d => d.name).join(', ').length > 50 ? '...' : ''}
                          </span>
                        </div>
                        <button
                          onClick={() => setUploadedDocs([])}
                          className={`p-1 rounded hover:bg-black/10 transition-colors flex-shrink-0 ml-2 ${
                            isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                          }`}
                          title="Remove all documents"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <div 
                      className="relative"
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {isDragging && (
                        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 ${
                          isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-400/20'
                        } backdrop-blur-sm border-4 border-dashed border-cyan-400 rounded-3xl`}>
                          <Upload size={64} className="animate-bounce text-cyan-400" />
                          <p className={`text-xl font-semibold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                            Drop your file here
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            PDF, DOCX, TXT, CSV, PPTX, Images supported
                          </p>
                        </div>
                      )}
                      <div className={`relative ${isDarkMode ? 'bg-[#2b2b2b]' : 'bg-white'} rounded-3xl border ${isDarkMode ? 'border-[#424242]' : 'border-gray-200'} shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden`}>
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
                          placeholder={uploadedDocs.length > 0 ? "Ask about your documents..." : "Message SynapseAI..."}
                          className={`w-full bg-transparent py-5 px-6 pr-28 ${isDarkMode ? 'text-[#ececf1] placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} focus:outline-none resize-none text-base leading-relaxed`}
                          style={{ minHeight: '64px', maxHeight: '200px' }}
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt,.md,.doc,.docx,.pptx,.csv,image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`p-2 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                            title="Upload document (PDF, DOCX, PPTX, CSV, TXT, Images)"
                          >
                            {isUploading ? (
                              <div className="animate-spin text-cyan-400">⏳</div>
                            ) : (
                              <Upload size={20} className={isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} />
                            )}
                          </button>
                          <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-2 rounded-lg transition-all ${
                              input.trim() 
                                ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                                : 'bg-transparent text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-4 text-sm text-gray-500">
                      {uploadedDocs.length > 0 ? (
                        <span className="flex items-center justify-center gap-1">
                          <Zap size={14} className="text-cyan-400" /> Answers powered by your documents + ML + RAG + Qwen
                        </span>
                      ) : (
                        <>
                          <Upload size={14} className="inline text-cyan-400 mr-1" />Upload documents for intelligent Q&A • Press <kbd className={`px-2 py-1 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} rounded text-xs font-medium`}>Enter</kbd> to send
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area - Scrollable (ChatGPT Style) */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto scrollbar-thin scroll-smooth"
              >
                <div 
                  className="px-4 pt-6 pb-32"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                    {/* Drag overlay for chat area */}
                    {isDragging && (
                      <div className="absolute inset-0 z-50 bg-cyan-500/20 backdrop-blur-sm border-4 border-dashed border-cyan-400 rounded-2xl flex items-center justify-center m-4">
                        <div className="text-center">
                          <Upload size={48} className="mx-auto mb-3 text-cyan-400 animate-bounce" />
                          <p className="text-xl font-bold text-white">Drop file to upload</p>
                          <p className="text-gray-300 text-sm mt-1">PDF, DOCX, TXT, CSV</p>
                        </div>
                      </div>
                    )}

                    <div className="max-w-3xl mx-auto space-y-6">
                      {activeChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className="group animate-fade-in"
                        >
                          {message.role === 'system' ? (
                            // System Message - Centered notification
                            <div className="flex justify-center">
                              <div className={`max-w-md p-4 rounded-xl ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-200'}`}>
                                <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-gray'} max-w-none text-sm`}>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          ) : message.role === 'assistant' ? (
                            // AI Message - Left aligned with avatar
                            <div className="flex gap-4 items-start">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-lg shadow-cyan-400/20">
                                <span className="text-sm font-bold text-white">S</span>
                              </div>

                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="font-semibold text-sm text-cyan-300">
                                  SynapseAI Student Assistant
                                </div>

                                <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-gray'} max-w-none streaming-text`}>
                                  <MessageRenderer 
                                    content={message.content}
                                    isDarkMode={isDarkMode}
                                  />
                                  {isStreaming && message.id === streamingMessageIdRef.current && (
                                    <span className="inline-block w-1.5 h-5 bg-cyan-400 animate-pulse ml-0.5 align-middle"></span>
                                  )}
                                </div>

                                {/* Source citations */}
                                {message.sources && message.sources.length > 0 && (
                                  <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                    <div className="text-xs font-semibold text-gray-400 mb-2">📚 Sources:</div>
                                    {message.sources.map((source, idx) => (
                                      <div key={`${message.id}-source-${idx}`} className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-white/5' : 'bg-white'} text-xs`}>
                                        <div className="font-medium text-cyan-400">{source.doc_name}</div>
                                        <div className="text-gray-500">{source.category} • {(source.similarity * 100).toFixed(0)}% relevant</div>
                                        <div className="text-gray-400 italic mt-1">&quot;{source.preview.slice(0, 100)}...&quot;</div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                  <button 
                                    onClick={() => setReplyTo(message.id)} 
                                    className={`p-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
                                    title="Reply"
                                  >
                                    <MessageSquare size={16} className="text-gray-400" />
                                  </button>
                                  <button 
                                    onClick={() => copyMessage(message.content)} 
                                    className={`p-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
                                    title="Copy"
                                  >
                                    <Copy size={16} className="text-gray-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // User Message - Right aligned in bubble
                            <div className="flex justify-end">
                              <div className="max-w-[80%]">
                                {message.replyTo && (
                                  <div className={`mb-2 p-2 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'} rounded-lg text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border-l-2 border-cyan-400`}>
                                    ↳ {activeChat.messages.find(m => m.id === message.replyTo)?.content.slice(0, 60)}...
                                  </div>
                                )}
                                
                                {/* File Attachments - ChatGPT style */}
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mb-2 space-y-1.5">
                                    {message.attachments.map((file, idx) => (
                                      <div 
                                        key={`${message.id}-attachment-${idx}`}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                                          isDarkMode 
                                            ? 'bg-white/10 border border-white/20' 
                                            : 'bg-white border border-gray-200'
                                        }`}
                                      >
                                        <FileText size={16} className="text-blue-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <div className={`font-medium truncate ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                          }`}>
                                            {file.name}
                                          </div>
                                          <div className={`text-xs ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                          }`}>
                                            {file.category} • {file.size}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className={`rounded-3xl px-5 py-3 shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                                  <div className="text-white text-base whitespace-pre-wrap break-words">
                                    {message.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-4 items-start">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 shadow-lg animate-pulse flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-cyan-300 mb-2">SynapseAI</div>
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

                  {/* Scroll to bottom button (ChatGPT-style) */}
                  {isUserScrolling && (
                    <button
                      onClick={() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        setIsUserScrolling(false);
                      }}
                      className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
                        isDarkMode ? 'bg-[#2b2b2b] hover:bg-[#3b3b3b] text-cyan-400' : 'bg-white hover:bg-gray-100 text-cyan-600'
                      } border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
                      title="Scroll to bottom"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 14L6 10H14L10 14Z" fill="currentColor"/>
                      </svg>
                    </button>
                  )}
              </div>

              {/* Input - Fixed at bottom (ChatGPT-style) */}
              <div ref={inputContainerRef} className={`sticky bottom-0 z-10 ${isDarkMode ? 'bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/95 to-transparent' : 'bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent'} pt-6 pb-4 px-4`}>
                    <div className="max-w-3xl mx-auto">
                      {/* Uploaded docs indicator - chat mode */}
                      {uploadedDocs.length > 0 && (
                        <div className={`mb-3 p-3 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'} border border-cyan-400/50 rounded-xl`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <FileText size={16} className="text-cyan-400" />
                              <span>{uploadedDocs.length} document{uploadedDocs.length > 1 ? 's' : ''} indexed</span>
                            </div>
                            <button
                              onClick={() => setUploadedDocs([])}
                              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {uploadedDocs.map((doc, idx) => (
                              <div key={`uploaded-doc-${idx}-${doc.name}`} className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-white'} flex items-center gap-1.5`}>
                                <FileText size={12} className="text-cyan-400" />
                                <span>{doc.name}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-cyan-400">{doc.category}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {replyTo && (
                        <div className={`mb-3 p-3 ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'} border border-cyan-400/50 rounded-xl text-sm flex justify-between items-center`}>
                          <span className="truncate">Reply to: {activeChat.messages.find(m => m.id === replyTo)?.content.slice(0, 50)}...</span>
                          <button onClick={() => setReplyTo(null)} className="text-cyan-400 hover:text-cyan-300 ml-2 font-bold">✕</button>
                        </div>
                      )}
                      <div 
                        className="relative"
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        {isDragging && (
                          <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 ${
                            isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-400/20'
                          } backdrop-blur-sm border-4 border-dashed border-cyan-400 rounded-3xl`}>
                            <Upload size={64} className="animate-bounce text-cyan-400" />
                            <p className={`text-xl font-semibold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
                              Drop your file here
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              PDF, DOCX, TXT, CSV, PPTX, Images supported
                            </p>
                          </div>
                        )}
                        <div className={`relative ${isDarkMode ? 'bg-[#2b2b2b]' : 'bg-white'} rounded-3xl border ${isDarkMode ? 'border-[#424242]' : 'border-gray-200'} shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden`}>
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
                          placeholder={uploadedDocs.length > 0 ? "Ask about your documents..." : "Message SynapseAI..."}
                          className={`w-full bg-transparent py-5 px-6 pr-28 ${isDarkMode ? 'text-[#ececf1] placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} focus:outline-none resize-none text-base leading-relaxed`}
                          style={{ minHeight: '56px', maxHeight: '200px' }}
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt,.md,.doc,.docx,.pptx,.csv,image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`p-2 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                            title="Upload document (PDF, DOCX, PPTX, CSV, TXT, Images)"
                          >
                            {isUploading ? (
                              <div className="animate-spin text-cyan-400">⏳</div>
                            ) : (
                              <Upload size={20} className={isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} />
                            )}
                          </button>
                          <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-2 rounded-lg transition-all ${
                              input.trim() 
                                ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                                : 'bg-transparent text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </>
          )}
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