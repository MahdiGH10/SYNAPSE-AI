// Example: How to integrate LLM API with your chat interface

'use client';
import React, { useState } from 'react';
import { sendMessage, streamMessage, getModels, validateMessage } from '@/lib/llm';
import type { Message, ModelInfo } from '@/lib/llm';

export default function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('synapse-creative');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load available models on mount
  React.useEffect(() => {
    loadAvailableModels();
  }, []);

  async function loadAvailableModels() {
    const availableModels = await getModels();
    setModels(availableModels);
  }

  // Standard (non-streaming) request
  async function handleSendStandard() {
    const validation = validateMessage(input);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue');
      setIsLoading(false);
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(token, {
        message: input,
        conversationHistory: messages,
        model: selectedModel,
        temperature: 0.7,
        maxTokens: 2000,
      });

      if (response.success && response.data) {
        // Add AI response to UI
        const aiMessage: Message = {
          role: 'assistant',
          content: response.data.message,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setError(response.error || 'Failed to get response');
      }
    } catch (error: any) {
      setError(error.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }

  // Streaming request
  async function handleSendStreaming() {
    const validation = validateMessage(input);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue');
      setIsLoading(false);
      return;
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Add empty AI message that will be filled during streaming
    const emptyAiMessage: Message = {
      role: 'assistant',
      content: '',
    };
    setMessages((prev) => [...prev, emptyAiMessage]);

    let fullResponse = '';

    await streamMessage(
      token,
      {
        message: userMessage.content,
        conversationHistory: messages,
        model: selectedModel,
        temperature: 0.7,
      },
      // On each chunk
      (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: fullResponse,
          };
          return newMessages;
        });
      },
      // On complete
      () => {
        setIsLoading(false);
      },
      // On error
      (error) => {
        setError(error);
        setIsLoading(false);
      }
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header with Model Selector */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">SynapseAI Chat</h1>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            disabled={isLoading}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.speed})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gray-800'
              }`}
            >
              <div className="text-xs opacity-60 mb-1">
                {message.role === 'user' ? 'You' : 'SynapseAI'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-500/20 border-t border-red-500 text-red-300">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendStreaming();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendStreaming}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Press Enter to send • Shift+Enter for new line • {input.length}/4000 characters
        </div>
      </div>
    </div>
  );
}
