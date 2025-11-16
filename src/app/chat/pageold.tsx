'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/Icon';
import { useChatStore } from '@/store/chatStore';
import { chatModels } from '@/lib/data';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    conversations,
    activeId,
    setActive,
    sendMessage,
    newConversation,
    deleteConversation,
  } = useChatStore();

  const activeConversation = conversations.find((c) => c.id === activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[280px] flex flex-col border-r"
            style={{
              backgroundColor: '#1E293B',
              borderColor: 'rgba(59, 130, 246, 0.1)',
            }}
          >
            {/* New Chat Button */}
            <div className="p-3">
              <motion.button
                onClick={() => newConversation()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: '#FFFFFF',
                }}
              >
                <Icon name="plus" size={20} />
                New Chat
              </motion.button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              {conversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  onClick={() => setActive(conv.id)}
                  whileHover={{ x: 4 }}
                  className="w-full px-3 py-3 rounded-lg flex items-center justify-between group"
                  style={{
                    backgroundColor: activeId === conv.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: activeId === conv.id ? '#60A5FA' : '#94A3B8',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon name="message-circle" size={18} />
                    <span className="text-sm truncate">{conv.title}</span>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="trash-2" size={16} style={{ color: '#EF4444' }} />
                  </motion.button>
                </motion.button>
              ))}
            </div>

            {/* User Profile */}
            <div
              className="p-3 border-t"
              style={{ borderColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  }}
                >
                  <Icon name="user" size={18} className="text-white" />
                </div>
                <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  User
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className="h-14 flex items-center justify-between px-4 border-b"
          style={{
            backgroundColor: '#1E293B',
            borderColor: 'rgba(59, 130, 246, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60A5FA',
              }}
            >
              <Icon name={sidebarOpen ? 'sidebar' : 'menu'} size={20} />
            </motion.button>
            <h1 className="font-semibold" style={{ color: '#F1F5F9' }}>
              {activeConversation?.title || 'New Chat'}
            </h1>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col relative">
          {!activeConversation?.messages.length ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  }}
                >
                  <Icon name="sparkles" size={32} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
                  How can I help you today?
                </h2>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  Ask me anything or start a conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {activeConversation.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        message.role === 'user'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    }}
                  >
                    <Icon
                      name={message.role === 'user' ? 'user' : 'bot'}
                      size={18}
                      style={{ color: message.role === 'user' ? '#60A5FA' : '#FFFFFF' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-2" style={{ color: '#F1F5F9' }}>
                      {message.role === 'user' ? 'You' : 'SynapseAI'}
                    </div>
                    <div
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: '#CBD5E1' }}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.1)' }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl p-2 flex items-end gap-2"
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message SynapseAI..."
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none px-3 py-3 text-sm max-h-32"
                style={{ color: '#F1F5F9' }}
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim()}
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50"
                style={{
                  background: input.trim()
                    ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                    : 'rgba(59, 130, 246, 0.2)',
                  color: '#FFFFFF',
                }}
              >
                <Icon name="send" size={18} />
              </motion.button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: '#64748B' }}>
              SynapseAI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}