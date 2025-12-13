import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { InferenceClient } from '@huggingface/inference';

// SynapseAI System Rules
const SYNAPSE_SYSTEM_RULES = `You are SynapseAI, an advanced AI assistant designed for professional and educational purposes.

CORE RULES:
1. Always be helpful, accurate, and ethical
2. Never provide harmful, illegal, or unethical content
3. Respect user privacy and data confidentiality
4. Cite sources when providing factual information
5. Admit when you don't know something rather than guessing

CAPABILITIES:
- Natural conversation and Q&A
- Code generation and debugging (all major languages)
- Document analysis and summarization
- Data analysis and visualization suggestions
- Creative writing and brainstorming
- Educational tutoring and explanations

RESPONSE STYLE:
- Be concise but thorough
- Use markdown formatting for better readability
- Provide code examples when relevant
- Break down complex topics into digestible parts
- Ask clarifying questions when needed

LIMITATIONS:
- Cannot access external URLs or real-time data
- Cannot execute code or make API calls
- Cannot remember conversations between sessions (unless context provided)
- Cannot access user's files without explicit upload

PROJECT CONTEXT:
You are part of SynapseAI, a platform built with Next.js, TypeScript, and MongoDB.
Users can chat, analyze documents, and get insights. Maintain a professional yet friendly tone.`;

// Rate limiting (in-memory, use Redis in production)
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset: 20 requests per 5 minutes
    rateLimiter.set(userId, {
      count: 1,
      resetTime: now + 5 * 60 * 1000,
    });
    return true;
  }

  if (userLimit.count >= 20) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get and verify JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded. Please wait before sending more messages.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      model = 'synapse-creative',
      temperature = 0.7,
      maxTokens = 2000,
    } = body;

    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { success: false, message: 'Message too long (max 4000 characters)' },
        { status: 400 }
      );
    }

    // Validate conversation history
    if (conversationHistory.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Conversation history too long (max 50 messages)' },
        { status: 400 }
      );
    }

    // Build messages array for LLM
    const messages = [
      { role: 'system', content: SYNAPSE_SYSTEM_RULES },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Call your LLM API (OpenAI, Anthropic, etc.)
    // This is a placeholder - replace with your actual LLM API
    const aiResponse = await callLLMAPI({
      messages,
      model,
      temperature,
      maxTokens,
    });

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse.content,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        conversationId: aiResponse.conversationId,
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// LLM API Integration
async function callLLMAPI(params: {
  messages: any[];
  model: string;
  temperature: number;
  maxTokens: number;
}) {
  const { messages, model, temperature, maxTokens } = params;

  // Check if Hugging Face API key is configured
  const hfToken = process.env.HF_TOKEN;

  if (!hfToken) {
    // Mock response for development/testing
    return {
      content: generateMockResponse(messages[messages.length - 1].content),
      model: model,
      tokensUsed: 150,
      conversationId: Date.now().toString(),
    };
  }

  // Real Hugging Face API call using Inference Client
  try {
    const client = new InferenceClient(hfToken);
    
    // Use chatCompletion with Qwen model via Together AI
    const chatCompletion = await client.chatCompletion({
      model: 'Qwen/Qwen2.5-7B-Instruct:together',
      messages: messages.map((msg: any) => ({
        role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      temperature: temperature,
      max_tokens: maxTokens,
    });

    const content = chatCompletion.choices[0]?.message?.content || 'No response generated';

    return {
      content: content,
      model: 'Qwen/Qwen2.5-7B-Instruct',
      tokensUsed: 0,
      conversationId: Date.now().toString(),
    };
  } catch (error) {
    console.error('LLM API Error:', error);
    throw error;
  }
}

// Map SynapseAI models to Hugging Face models
function mapModelToProvider(synapseModel: string): string {
  // All models use Qwen 2.5-7B Instruct
  return 'Qwen/Qwen2.5-7B-Instruct';
}

// Mock response generator for development
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Code-related query
  if (
    lowerMessage.includes('code') ||
    lowerMessage.includes('function') ||
    lowerMessage.includes('bug')
  ) {
    return `I'd be happy to help with your coding question! Based on your query, here's what I suggest:

\`\`\`typescript
// Example implementation
function exampleFunction(param: string): void {
  console.log('This is a code example:', param);
}
\`\`\`

This approach is recommended because:
1. It follows TypeScript best practices
2. It's type-safe and maintainable
3. It's well-documented

Would you like me to explain any part in more detail?`;
  }

  // Greeting
  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey')
  ) {
    return `Hello! I'm SynapseAI, your intelligent assistant. I'm here to help you with:

- 💻 Code generation and debugging
- 📚 Learning and explanations
- 📊 Data analysis insights
- ✍️ Writing and brainstorming
- 🔍 Research and information

What can I help you with today?`;
  }

  // Default response
  return `I understand your question about "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}".

Based on my analysis, here's a comprehensive response:

**Key Points:**
1. This is a complex topic that requires careful consideration
2. There are multiple approaches you could take
3. The best solution depends on your specific requirements

**Recommendation:**
I suggest breaking down the problem into smaller parts and tackling each one systematically. Would you like me to elaborate on any specific aspect?

**Note:** This is a mock response for development. Configure \`GEMINI_API_KEY\` in your environment variables for real AI responses.`;
}

