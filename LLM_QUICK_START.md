# SynapseAI LLM Implementation - Quick Start

## ✅ What Was Implemented

I've created a complete LLM API system for SynapseAI with project-specific rules, security, and best practices.

## 📁 Files Created

### 1. **API Routes**
```
src/app/api/chat/
├── route.ts              # Main chat endpoint (standard responses)
├── stream/route.ts       # Streaming responses endpoint
└── models/route.ts       # Get available AI models
```

### 2. **Helper Library**
```
src/lib/llm.ts           # Helper functions, types, and utilities
```

### 3. **Documentation**
```
LLM_API_GUIDE.md         # Complete API documentation
```

### 4. **Example Component**
```
src/components/ChatExample.tsx    # Ready-to-use chat component
```

## 🎯 Key Features

### 1. **Project-Specific Rules**
The AI follows SynapseAI guidelines:
- ✅ Professional and educational focus
- ✅ Ethical responses only
- ✅ Privacy and confidentiality
- ✅ Code generation for all languages
- ✅ Document analysis capabilities
- ✅ Educational tutoring style

### 2. **Security**
- ✅ JWT authentication required
- ✅ Rate limiting (20 requests/5 min per user)
- ✅ Input validation (max 4000 chars)
- ✅ Conversation history limits (max 50 messages)

### 3. **Multiple AI Models**
- **synapse-creative** - Best for brainstorming (128K context)
- **synapse-precision** - Best for technical tasks (8K context)
- **synapse-fast** - Quick answers (16K context, fastest)
- **synapse-code** - Specialized for coding (8K context)

### 4. **Two Response Modes**
- **Standard**: Complete response at once
- **Streaming**: Real-time word-by-word streaming

## 🚀 Quick Usage

### Step 1: Add OpenAI API Key (Optional)

The API works in **mock mode** without a key, or add a real key for production:

```env
# In .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

Get your key: https://platform.openai.com/api-keys

### Step 2: Use in Your Chat Interface

```typescript
import { streamMessage } from '@/lib/llm';

// Get token from localStorage
const token = localStorage.getItem('token');

// Send streaming message
await streamMessage(
  token!,
  {
    message: "Explain async/await in JavaScript",
    model: "synapse-creative"
  },
  // On each chunk
  (chunk) => {
    console.log('Received:', chunk);
  },
  // On complete
  () => {
    console.log('Stream finished!');
  },
  // On error
  (error) => {
    console.error('Error:', error);
  }
);
```

### Step 3: Test the API

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Test endpoints
# Get available models
curl http://localhost:3000/api/chat/models

# Send a message (replace YOUR_TOKEN with real JWT)
curl -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, SynapseAI!"}'
```

## 📊 API Endpoints

### 1. `POST /api/chat` - Standard Response
Send message, get complete response.

**Request:**
```json
{
  "message": "Your question here",
  "conversationHistory": [],
  "model": "synapse-creative",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

### 2. `POST /api/chat/stream` - Streaming Response
Send message, get real-time streaming response.

**Request:** Same as above
**Response:** Server-Sent Events (SSE)

### 3. `GET /api/chat/models` - Available Models
Get list of all AI models with details.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "synapse-creative",
      "name": "Synapse Creative",
      "speed": "medium",
      "contextWindow": 128000,
      "recommended": ["brainstorming", "creative-writing"]
    }
  ]
}
```

## 🔧 Integration with Existing Chat

Update your `src/app/chat/page.tsx`:

```typescript
import { streamMessage } from '@/lib/llm';

// Replace your existing sendMessage function with:
async function handleSendMessage() {
  const token = localStorage.getItem('token');
  let fullResponse = '';

  await streamMessage(
    token!,
    {
      message: input,
      conversationHistory: messages,
      model: selectedModel
    },
    (chunk) => {
      fullResponse += chunk;
      // Update your message state here
    },
    () => {
      console.log('Message complete');
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}
```

## 🛡️ System Rules (Built-in)

The AI automatically follows these rules:

**✅ Always:**
- Be helpful, accurate, and ethical
- Provide code examples when relevant
- Use markdown formatting
- Respect user privacy
- Cite sources for facts

**❌ Never:**
- Provide harmful or illegal content
- Share sensitive data
- Make up information
- Execute external code

## 💰 Cost Considerations

### Without OpenAI Key (FREE)
- Uses intelligent mock responses
- Perfect for development
- No external API calls
- No costs

### With OpenAI Key (PAID)
Example costs per 1000 messages (avg 500 tokens):
- GPT-3.5 Turbo (synapse-fast): ~$1.50
- GPT-4 Turbo (synapse-creative): ~$30
- GPT-4 (synapse-precision): ~$60

**Tip:** Start with mock mode for testing, then add your API key when ready!

## 📚 Helper Functions

```typescript
import { 
  validateMessage,      // Validate user input
  estimateTokens,       // Estimate token count
  truncateConversationHistory,  // Fit context window
  getModels            // Get available models
} from '@/lib/llm';

// Validate before sending
const { valid, error } = validateMessage(userInput);
if (!valid) {
  console.error(error);
}

// Estimate costs
const tokens = estimateTokens("Your message");
console.log(`This will use ~${tokens} tokens`);

// Truncate long conversations
const truncated = truncateConversationHistory(messages, 4000);
```

## 🎨 Example Component

See `src/components/ChatExample.tsx` for a complete working example with:
- Model selector dropdown
- Streaming responses
- Error handling
- Loading states
- Character counter
- Keyboard shortcuts

## ⚡ Rate Limiting

- **Limit:** 20 requests per 5 minutes per user
- **Response:** 429 error when exceeded
- **Note:** In-memory (resets on restart)

**For Production:** Replace with Redis-based rate limiting (see LLM_API_GUIDE.md)

## 🔐 Authentication

All endpoints require JWT token:

```typescript
// In your request headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Get token from:
1. Login: `POST /api/auth/login`
2. Google OAuth callback
3. Stored in `localStorage.getItem('token')`

## 🧪 Testing Checklist

- [ ] Test without OpenAI key (mock mode)
- [ ] Test with OpenAI key (real responses)
- [ ] Test rate limiting (send 21 requests quickly)
- [ ] Test all 4 models
- [ ] Test streaming vs standard responses
- [ ] Test with long conversation history
- [ ] Test with very long messages (>4000 chars should fail)
- [ ] Test without auth token (should fail with 401)

## 🚀 Next Steps

1. **Update Chat Interface**
   - Integrate streaming responses
   - Add model selector
   - Show typing indicator

2. **Add Conversation Persistence**
   - Save to MongoDB
   - Load previous conversations
   - Delete conversations

3. **Enhance Features**
   - Add file upload for document analysis
   - Implement conversation search
   - Add export conversation feature
   - Show token usage statistics

4. **Production Ready**
   - Add Redis for rate limiting
   - Implement cost tracking
   - Set up monitoring
   - Add error tracking (Sentry)

## 📖 Full Documentation

See `LLM_API_GUIDE.md` for complete details on:
- All API endpoints with examples
- Error handling
- Cost estimation
- Production deployment
- Advanced features

---

**Your LLM API is ready!** 🎉

Start with mock mode to test, then add your OpenAI API key when ready for production.
