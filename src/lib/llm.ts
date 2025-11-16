// LLM Helper Functions and Types

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  message: string;
  conversationHistory?: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  success: boolean;
  data?: {
    message: string;
    model: string;
    tokensUsed: number;
    conversationId: string;
  };
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  baseModel: string;
  description: string;
  capabilities: string[];
  contextWindow: number;
  maxTokens: number;
  pricing: {
    input: number;
    output: number;
  };
  speed: 'fast' | 'medium' | 'slow';
  recommended: string[];
}

/**
 * Send a message to the LLM API
 */
export async function sendMessage(
  token: string,
  request: LLMRequest
): Promise<LLMResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to send message',
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * Stream a message from the LLM API
 */
export async function streamMessage(
  token: string,
  request: LLMRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      onError(error.error || 'Failed to stream message');
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response body');
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    onComplete();
  } catch (error: any) {
    onError(error.message || 'Network error');
  }
}

/**
 * Get available models
 */
export async function getModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch('/api/chat/models');
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    return data.data;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

/**
 * Validate message content
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 4000) {
    return { valid: false, error: 'Message too long (max 4000 characters)' };
  }

  return { valid: true };
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Truncate conversation history to fit context window
 */
export function truncateConversationHistory(
  messages: Message[],
  maxTokens: number
): Message[] {
  let totalTokens = 0;
  const truncated: Message[] = [];

  // Keep system message if present
  if (messages[0]?.role === 'system') {
    truncated.push(messages[0]);
    totalTokens += estimateTokens(messages[0].content);
    messages = messages.slice(1);
  }

  // Add messages from most recent, working backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content);
    if (totalTokens + tokens > maxTokens) {
      break;
    }
    truncated.unshift(messages[i]);
    totalTokens += tokens;
  }

  return truncated;
}

/**
 * Format conversation for display
 */
export function formatConversation(messages: Message[]): string {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const role = m.role === 'user' ? 'You' : 'SynapseAI';
      return `${role}: ${m.content}`;
    })
    .join('\n\n');
}
