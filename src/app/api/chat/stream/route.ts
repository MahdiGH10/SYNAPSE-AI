import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { InferenceClient } from '@huggingface/inference';

// Same system rules as main chat API
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
- Ask clarifying questions when needed`;

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
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

    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429 }
      );
    }

    // Parse request
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      model = 'synapse-creative',
      temperature = 0.7,
    } = body;

    // Validation
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400 }
      );
    }

    // Build messages
    const messages = [
      { role: 'system', content: SYNAPSE_SYSTEM_RULES },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Check if Hugging Face is configured
    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      // Mock streaming response
      return createMockStreamResponse(message);
    }

    // Real streaming from Hugging Face using Inference Client
    try {
      const client = new InferenceClient(hfToken);
      
      // Get chat completion (will simulate streaming from the complete response)
      const chatCompletion = await client.chatCompletion({
        model: 'Qwen/Qwen2.5-7B-Instruct:together',
        messages: messages.map((msg: any) => ({
          role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
        temperature: temperature,
        max_tokens: 2000,
      });

      const content = chatCompletion.choices[0]?.message?.content || 'No response generated';
      
      // Create simulated streaming response
      const transformedStream = createStreamingResponse(content);

      return new Response(transformedStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (error: any) {
      console.error('Stream API Error:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error: any) {
    console.error('Stream API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function mapModelToProvider(synapseModel: string): string {
  return 'Qwen/Qwen2.5-7B-Instruct';
}

function createStreamingResponse(fullText: string): ReadableStream {
  const encoder = new TextEncoder();
  const words = fullText.split(' ');

  return new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`));
          // Small delay to simulate streaming
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

function createMockStreamResponse(message: string): Response {
  const encoder = new TextEncoder();
  const mockResponse = `I received your message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"

This is a mock streaming response. To enable real AI responses, please configure your \`OPENAI_API_KEY\` in the environment variables.

**Features available:**
- Streaming responses
- Context-aware conversations
- Multiple AI models
- Rate limiting
- User authentication

Would you like help with anything else?`;

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;
      const words = mockResponse.split(' ');

      const interval = setInterval(() => {
        if (index < words.length) {
          const chunk = words[index] + ' ';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          index++;
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 50);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
