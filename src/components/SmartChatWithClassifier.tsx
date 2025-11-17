'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, X, CheckCircle, Sparkles, MessageSquare, Send } from 'lucide-react';
import { classifyDocument } from '@/lib/classifier';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  confidence?: number;
}

export default function SmartChatWithClassifier() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smart routing based on document category
  const getContextualPrompt = (category: string, text: string) => {
    const prompts: Record<string, string> = {
      'Business Documents': `Analyze this business document and provide key insights, action items, and strategic recommendations: ${text}`,
      'Technical Reports': `Explain this technical content in simple terms, highlight key technical points, and suggest implementation steps: ${text}`,
      'Financial Analysis': `Analyze these financial details, identify trends, risks, and provide investment insights: ${text}`,
      'Scientific Papers': `Summarize the research findings, methodology, and practical applications of this scientific content: ${text}`,
    };
    return prompts[category] || `Analyze this ${category} document: ${text}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setShowFilePreview(true);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(uploadedFile);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: file ? `📎 ${file.name}\n\n${input.slice(0, 200)}...` : input,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Step 1: Classify the document
      const classification = await classifyDocument(input, true);

      if (classification.success && classification.prediction) {
        // Step 2: Add classification result message
        const classificationMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🎯 **Document Classified**: ${classification.prediction} (${(classification.confidence! * 100).toFixed(1)}% confidence)\n\nProcessing your document with specialized ${classification.prediction} analysis...`,
          category: classification.prediction,
          confidence: classification.confidence,
        };
        setMessages(prev => [...prev, classificationMessage]);

        // Step 3: Get AI response with context-aware prompt
        await new Promise(resolve => setTimeout(resolve, 1000));

        const contextualPrompt = getContextualPrompt(classification.prediction, input);
        
        // Call your LLM API with the contextual prompt
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            message: contextualPrompt,
            conversationHistory: messages.slice(-6),
            model: 'synapse-creative',
          }),
        });

        const data = await response.json();

        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: data.data?.message || 'Analysis complete!',
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
      setInput('');
      setFile(null);
      setShowFilePreview(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#060913] text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart Document Chat</h1>
            <p className="text-sm text-gray-400">AI-powered with automatic document classification</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Upload a document or paste text</p>
            <p className="text-sm">Documents are automatically classified and analyzed</p>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-5 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80'
                  : 'bg-gray-800/50'
              }`}
            >
              {message.category && (
                <div className="flex items-center gap-2 mb-2 text-xs text-cyan-300">
                  <CheckCircle size={14} />
                  <span>{message.category} • {(message.confidence! * 100).toFixed(1)}%</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 px-5 py-3 rounded-2xl flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-blue-400" />
              <span className="text-gray-300">Analyzing document...</span>
            </div>
          </div>
        )}
      </div>

      {/* File Preview */}
      <AnimatePresence>
        {showFilePreview && file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-6 mb-2 p-3 bg-gray-800/50 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-400" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setShowFilePreview(false);
                setInput('');
              }}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Upload size={20} className="text-gray-300" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Upload a document or type your message..."
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Documents are automatically classified and routed to specialized AI handlers
          </p>
        </div>
      </div>
    </div>
  );
}
