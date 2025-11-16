# SynapseAI LLM API Guide

## 🤖 Overview

The SynapseAI LLM API provides intelligent conversational AI capabilities with project-specific rules, rate limiting, and multiple model options.

## 📁 Files Created

```
src/
├── app/api/chat/
│   ├── route.ts              # Main chat endpoint (non-streaming)
│   ├── stream/
│   │   └── route.ts          # Streaming chat endpoint
│   └── models/
│       └── route.ts          # Available models endpoint
└── lib/
    └── llm.ts                # LLM helper functions and types
```

## 🎯 Core Features

### 1. **Authentication & Security**
- JWT token verification required
- Rate limiting: 20 requests per 5 minutes per user
- Input validation and sanitization
- Protected routes with Bearer token

### 2. **Project-Specific Rules**
The system follows SynapseAI-specific guidelines:
- Professional and educational focus
- Ethical AI responses
- Privacy and data confidentiality
- Code generation for all major languages
- Document analysis capabilities
- Educational tutoring style

### 3. **Multiple AI Models**

| Model ID | Name | Speed | Best For | Context |
|----------|------|-------|----------|---------|
| `synapse-creative` | Synapse Creative | Medium | Brainstorming, creative writing | 128K tokens |
| `synapse-precision` | Synapse Precision | Slow | Technical tasks, coding | 8K tokens |
| `synapse-fast` | Synapse Fast | Fast | Quick answers, simple tasks | 16K tokens |
| `synapse-code` | Synapse Code | Medium | Code generation, debugging | 8K tokens |

### 4. **Two Response Modes**
- **Standard**: Single complete response
- **Streaming**: Real-time word-by-word streaming

## 🚀 API Endpoints

### 1. POST `/api/chat` (Standard Response)

Send a message and get a complete response.

**Request:**
```typescript
POST /api/chat
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "message": "Explain how async/await works in JavaScript",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello!"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ],
  "model": "synapse-creative",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Async/await is a modern JavaScript feature...",
    "model": "gpt-4-turbo-preview",
    "tokensUsed": 250,
    "conversationId": "12345"
  }
}
```

### 2. POST `/api/chat/stream` (Streaming Response)

Send a message and get a streaming response.

**Request:**
```typescript
POST /api/chat/stream
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "message": "Write a React component",
  "conversationHistory": [],
  "model": "synapse-code",
  "temperature": 0.5
}
```

**Response:** (Server-Sent Events)
```
data: {"content": "Here's "}
data: {"content": "a "}
data: {"content": "React "}
data: {"content": "component:\n\n"}
data: [DONE]
```

### 3. GET `/api/chat/models`

Get available AI models.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "synapse-creative",
      "name": "Synapse Creative",
      "provider": "openai",
      "baseModel": "gpt-4-turbo-preview",
      "description": "Best for brainstorming...",
      "capabilities": ["Creative content", "..."],
      "contextWindow": 128000,
      "maxTokens": 4096,
      "pricing": {
        "input": 0.01,
        "output": 0.03
      },
      "speed": "medium",
      "recommended": ["creative-writing", "brainstorming"]
    }
  ],
  "meta": {
    "total": 4,
    "default": "synapse-creative"
  }
}
```

## 💻 Usage Examples

### Frontend Integration (React/Next.js)

#### 1. Standard Request
```typescript
import { sendMessage } from '@/lib/llm';

async function handleSendMessage(message: string) {
  const token = localStorage.getItem('token');
  
  const response = await sendMessage(token!, {
    message: message,
    conversationHistory: previousMessages,
    model: 'synapse-creative',
    temperature: 0.7
  });

  if (response.success) {
    console.log('AI Response:', response.data?.message);
  } else {
    console.error('Error:', response.error);
  }
}
```

#### 2. Streaming Request
```typescript
import { streamMessage } from '@/lib/llm';

async function handleStreamMessage(message: string) {
  const token = localStorage.getItem('token');
  let fullResponse = '';

  await streamMessage(
    token!,
    {
      message: message,
      model: 'synapse-fast'
    },
    // On each chunk
    (chunk) => {
      fullResponse += chunk;
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: fullResponse
      }]);
    },
    // On complete
    () => {
      console.log('Stream complete!');
    },
    // On error
    (error) => {
      console.error('Stream error:', error);
    }
  );
}
```

#### 3. Get Available Models
```typescript
import { getModels } from '@/lib/llm';

async function loadModels() {
  const models = await getModels();
  console.log('Available models:', models);
}
```

## 🔧 Configuration

### 1. Environment Variables

Add to `.env.local`:
```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env.local` file

### 2. Without OpenAI Key

The API works in **mock mode** without an OpenAI key:
- Returns intelligent mock responses
- Great for development/testing
- No external API calls
- No costs incurred

## 📊 Rate Limiting

- **Limit:** 20 requests per 5 minutes per user
- **Scope:** Per authenticated user (based on JWT)
- **Response:** 429 Too Many Requests when exceeded

**Production Recommendation:**
Replace in-memory rate limiting with Redis:
```typescript
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate_limit:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 300); // 5 minutes
  }
  
  return count <= 20;
}
```

## 🛡️ Security Features

1. **JWT Authentication**
   - All endpoints require valid JWT token
   - Token must be in Authorization header: `Bearer <token>`

2. **Input Validation**
   - Maximum message length: 4,000 characters
   - Maximum conversation history: 50 messages
   - Type checking for all inputs

3. **Rate Limiting**
   - Prevents API abuse
   - Per-user limits
   - Configurable time windows

4. **Error Handling**
   - Sanitized error messages in production
   - Detailed errors in development
   - No sensitive data exposure

## 🎨 System Rules

The AI follows these project-specific rules:

**Core Principles:**
- Helpful, accurate, and ethical responses
- No harmful, illegal, or unethical content
- Respects privacy and confidentiality
- Cites sources for facts
- Admits when unsure

**Capabilities:**
- Natural conversations
- Code generation (all languages)
- Document analysis
- Data insights
- Creative writing
- Educational tutoring

**Response Style:**
- Concise but thorough
- Markdown formatting
- Code examples when relevant
- Clear explanations
- Asks clarifying questions

## 📈 Cost Estimation

### OpenAI Pricing (as of 2024)

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-4 | $0.03 | $0.06 |
| GPT-3.5 Turbo | $0.0005 | $0.0015 |

**Example Costs:**
- 100 messages (avg 500 tokens each) with GPT-3.5: ~$0.15
- 100 messages (avg 500 tokens each) with GPT-4: ~$3.00
- 1000 users, 10 messages/day with GPT-3.5: ~$15/day

## 🔄 Context Management

Helper functions for managing conversation context:

```typescript
import { 
  estimateTokens, 
  truncateConversationHistory,
  validateMessage 
} from '@/lib/llm';

// Estimate tokens
const tokens = estimateTokens("Your message here");

// Validate message
const { valid, error } = validateMessage(userInput);

// Truncate to fit context window
const truncated = truncateConversationHistory(messages, 4000);
```

## 🧪 Testing

### Test with cURL

```bash
# Get available models
curl http://localhost:3000/api/chat/models

# Send a chat message
curl -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, SynapseAI!",
    "model": "synapse-fast"
  }'

# Stream a response
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a function to sort an array",
    "model": "synapse-code"
  }'
```

## 🚀 Production Checklist

- [ ] Add OpenAI API key to environment
- [ ] Implement Redis-based rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure error tracking (Sentry)
- [ ] Add request/response caching
- [ ] Implement conversation persistence to database
- [ ] Set up cost alerts
- [ ] Add user quota management
- [ ] Implement model fallbacks
- [ ] Add response moderation

## 📚 Next Steps

1. **Integrate with Chat UI**
   - Update `src/app/chat/page.tsx` to use new API
   - Add model selector dropdown
   - Implement streaming responses

2. **Add Conversation Persistence**
   - Create Conversation model in MongoDB
   - Save conversation history
   - Load previous conversations

3. **Add File Analysis**
   - Create document upload endpoint
   - Integrate with LLM for analysis
   - Return structured insights

4. **Implement User Quotas**
   - Track token usage per user
   - Set monthly limits
   - Display usage statistics

---

**Ready to chat!** Your LLM API is configured and ready for intelligent conversations. 🚀
