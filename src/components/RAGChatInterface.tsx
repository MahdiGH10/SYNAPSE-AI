'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Send, Loader2, CheckCircle, AlertCircle,
  BookOpen, Search, Brain, Sparkles, ExternalLink, X
} from 'lucide-react';

interface Document {
  doc_id: number;
  doc_name: string;
  category: string;
  confidence: number;
  chunks: number;
  timestamp: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Array<{
    doc_name: string;
    category: string;
    similarity: number;
    preview: string;
  }>;
}

export default function RAGChatInterface() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDocuments();
    
    // Welcome message
    setMessages([{
      id: '0',
      type: 'system',
      content: '👋 Welcome to Smart Document Assistant! Upload PDFs or documents, then ask me anything about them. Your ML classifier automatically organizes everything.'
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/rag/upload', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Add system message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'system',
          content: `✅ **${file.name}** uploaded successfully!\n📊 Classified as: **${data.classification.category}** (${(data.classification.confidence * 100).toFixed(1)}% confidence)\n📄 Created ${data.chunks_created} searchable chunks\n\nYou can now ask questions about this document!`
        }]);

        await loadDocuments();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: '❌ Upload failed. Please try again.'
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!input.trim() || isQuerying) return;

    const question = input.trim();
    setInput('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question
    };
    setMessages(prev => [...prev, userMessage]);

    setIsQuerying(true);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question,
          category: selectedCategory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant message with sources
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.answer,
          sources: data.sources
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'I couldn\'t find relevant information to answer your question. Try uploading more documents or rephrasing your question.'
        }]);
      }
    } catch (error) {
      console.error('Query failed:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '❌ Failed to process question. Please try again.'
      }]);
    } finally {
      setIsQuerying(false);
    }
  };

  const uniqueCategories = Array.from(new Set(documents.map(d => d.category)));

  return (
    <div className="flex h-screen bg-[#060913] text-white">
      {/* Sidebar - Document Library */}
      <div className="w-80 border-r border-gray-800 bg-gray-900/30 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-blue-400" />
            Document Library
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {documents.length} documents indexed
          </p>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Upload Document</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Category Filter */}
        {uniqueCategories.length > 0 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-400 mb-2">Filter by category:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {documents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No documents yet</p>
              <p className="text-xs">Upload to get started</p>
            </div>
          ) : (
            documents.map(doc => (
              <motion.div
                key={doc.doc_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <FileText size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.doc_name}</p>
                    <p className="text-xs text-gray-400 mt-1">{doc.category}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{doc.chunks} chunks</span>
                      <span>•</span>
                      <span>{(doc.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Document Assistant</h1>
              <p className="text-sm text-gray-400">
                Powered by your ML classifier + RAG + Qwen LLM
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 px-5 py-3 rounded-2xl'
                  : message.type === 'system'
                  ? 'bg-gray-800/30 px-5 py-3 rounded-2xl border border-gray-700'
                  : 'bg-gray-800/50 px-5 py-3 rounded-2xl'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <ExternalLink size={12} />
                      Sources:
                    </p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-xs bg-gray-900/50 p-2 rounded">
                          <p className="font-medium text-blue-300">{source.doc_name}</p>
                          <p className="text-gray-400 mt-1">{source.category} • {(source.similarity * 100).toFixed(0)}% relevance</p>
                          <p className="text-gray-500 mt-1 italic">&quot;{source.preview}...&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isQuerying && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 px-5 py-3 rounded-2xl flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-blue-400" />
                <span className="text-gray-300">Searching documents and generating answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
                placeholder={documents.length === 0 
                  ? "Upload documents first, then ask questions..." 
                  : "Ask anything about your documents..."}
                disabled={documents.length === 0 || isQuerying}
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
              />
              <button
                onClick={handleAskQuestion}
                disabled={!input.trim() || isQuerying || documents.length === 0}
                className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {selectedCategory 
                ? `Searching in: ${selectedCategory}` 
                : 'Searching across all documents'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
