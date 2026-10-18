# SynapseAI LLM Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React/Next.js Frontend)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │ + JWT Token
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                         │
│                     (Authentication Layer)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  POST /api/chat │  │ POST /api/chat/  │  │ GET /api/chat/ │ │
│  │   (Standard)    │  │    stream        │  │    models      │ │
│  │                 │  │  (Streaming)     │  │                │ │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬───────┘ │
│           │                    │                      │         │
│           └────────────────────┼──────────────────────┘         │
│                                │                                │
│                    ┌───────────▼──────────┐                     │
│                    │   Authentication     │                     │
│                    │  - Verify JWT Token  │                     │
│                    │  - Extract User ID   │                     │
│                    └───────────┬──────────┘                     │
│                                │                                │
│                    ┌───────────▼──────────┐                     │
│                    │    Rate Limiting     │                     │
│                    │ - Check user quota   │                     │
│                    │ - 20 req/5 min       │                     │
│                    └───────────┬──────────┘                     │
│                                │                                │
│                    ┌───────────▼──────────┐                     │
│                    │   Input Validation   │                     │
│                    │ - Max 4000 chars     │                     │
│                    │ - Max 50 messages    │                     │
│                    └───────────┬──────────┘                     │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                                 │ Validated Request
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SYSTEM RULES LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  SYNAPSE_SYSTEM_RULES                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Core Rules:                                               │  │
│  │ • Be helpful, accurate, ethical                          │  │
│  │ • Never harmful/illegal content                          │  │
│  │ • Respect privacy                                        │  │
│  │                                                           │  │
│  │ Capabilities:                                            │  │
│  │ • Natural conversation                                   │  │
│  │ • Code generation (all languages)                       │  │
│  │ • Document analysis                                      │  │
│  │ • Educational tutoring                                   │  │
│  │                                                           │  │
│  │ Response Style:                                          │  │
│  │ • Concise but thorough                                   │  │
│  │ • Markdown formatting                                    │  │
│  │ • Code examples when relevant                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ System Prompt + User Message
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MODEL ROUTER                            │
├─────────────────────────────────────────────────────────────────┤
│  synapse-creative  →  GPT-4 Turbo    (128K context, creative)  │
│  synapse-precision →  GPT-4          (8K context, precise)     │
│  synapse-fast      →  GPT-3.5 Turbo  (16K context, fast)       │
│  synapse-code      →  GPT-4          (8K context, coding)      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼                           ▼
       ┌───────────────────────┐   ┌───────────────────────┐
       │   WITH API KEY        │   │   WITHOUT API KEY     │
       │   (Production)        │   │   (Development)       │
       ├───────────────────────┤   ├───────────────────────┤
       │  OpenAI API           │   │  Mock Responses       │
       │  • Real AI responses  │   │  • Intelligent mocks  │
       │  • Token tracking     │   │  • No costs           │
       │  • Cost per use       │   │  • Instant replies    │
       └───────────┬───────────┘   └───────────┬───────────┘
                   │                           │
                   └───────────┬───────────────┘
                               │
                               │ AI Response
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESPONSE HANDLER                           │
├─────────────────────────────────────────────────────────────────┤
│  Standard Mode:            │  Streaming Mode:                   │
│  • Complete response       │  • Word-by-word                    │
│  • Single JSON return      │  • Server-Sent Events              │
│  • Simple to use           │  • Real-time feel                  │
└────────────────────────────┴────────────────────────────────────┘
                               │
                               │ Formatted Response
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (Optional)                        │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Collections:                                           │
│  • conversations (chat history)                                 │
│  • messages (individual messages)                               │
│  • usage_logs (token tracking)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example

```
1. User types message in chat interface
   ↓
2. Frontend calls streamMessage() from lib/llm.ts
   ↓
3. Request sent to POST /api/chat/stream
   └─ Headers: Authorization: Bearer <JWT>
   └─ Body: { message, model, conversationHistory }
   ↓
4. API Route verifies JWT token
   └─ Extract userId from token
   └─ If invalid → 401 Unauthorized
   ↓
5. Check rate limit for user
   └─ If exceeded → 429 Rate Limited
   ↓
6. Validate input
   └─ Check message length (max 4000)
   └─ Check history length (max 50)
   └─ If invalid → 400 Bad Request
   ↓
7. Build messages array
   └─ Add system rules (SYNAPSE_SYSTEM_RULES)
   └─ Add conversation history
   └─ Add user message
   ↓
8. Map model (synapse-creative → gpt-4-turbo)
   ↓
9. Check if OPENAI_API_KEY exists
   ├─ YES → Call OpenAI API
   │   └─ Stream response chunks
   └─ NO → Generate mock response
       └─ Stream mock chunks
   ↓
10. Stream response to client
    └─ Server-Sent Events
    └─ data: {"content": "word "}
    └─ data: [DONE]
    ↓
11. Frontend receives chunks
    └─ Update UI word-by-word
    └─ Show typing animation
    ↓
12. Complete
    └─ Save to conversation history
    └─ Log usage (optional)
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Security Checkpoint 1           │
│         JWT Authentication              │
│  • Valid token required                 │
│  • Token expiry check                   │
│  • User verification                    │
└──────────────┬──────────────────────────┘
               │ ✓ Authenticated
               ▼
┌─────────────────────────────────────────┐
│         Security Checkpoint 2           │
│         Rate Limiting                   │
│  • Per-user quota (20/5min)             │
│  • Prevents abuse                       │
│  • Cost control                         │
└──────────────┬──────────────────────────┘
               │ ✓ Within limits
               ▼
┌─────────────────────────────────────────┐
│         Security Checkpoint 3           │
│         Input Validation                │
│  • Message length check                 │
│  • History size check                   │
│  • Type validation                      │
│  • XSS prevention                       │
└──────────────┬──────────────────────────┘
               │ ✓ Valid input
               ▼
┌─────────────────────────────────────────┐
│         Security Checkpoint 4           │
│         System Rules                    │
│  • Ethical guidelines                   │
│  • Content filtering                    │
│  • Privacy protection                   │
└──────────────┬──────────────────────────┘
               │ ✓ Safe to process
               ▼
            Process Request
```

## 📊 Data Flow (Message Processing)

```
User Message: "Explain async/await"
         │
         ▼
┌─────────────────────────────────────────┐
│  Build Messages Array                   │
├─────────────────────────────────────────┤
│  [                                      │
│    {                                    │
│      role: "system",                    │
│      content: SYNAPSE_SYSTEM_RULES      │
│    },                                   │
│    {                                    │
│      role: "user",                      │
│      content: "Hello"                   │
│    },                                   │
│    {                                    │
│      role: "assistant",                 │
│      content: "Hi! How can I help?"     │
│    },                                   │
│    {                                    │
│      role: "user",                      │
│      content: "Explain async/await"     │
│    }                                    │
│  ]                                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Estimate Tokens                        │
│  System: ~500 tokens                    │
│  History: ~200 tokens                   │
│  User: ~10 tokens                       │
│  Total: ~710 tokens                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Send to LLM (OpenAI)                   │
│  Model: gpt-4-turbo-preview             │
│  Temperature: 0.7                       │
│  Max Tokens: 2000                       │
│  Stream: true                           │
└──────────────┬──────────────────────────┘
               │
               ▼
        Stream Response
         "Async/await "
         "is a modern "
         "JavaScript "
         "feature that..."
               │
               ▼
┌─────────────────────────────────────────┐
│  Track Usage                            │
│  Input tokens: 710                      │
│  Output tokens: 245                     │
│  Total tokens: 955                      │
│  Cost: $0.014 (GPT-4 Turbo)            │
└─────────────────────────────────────────┘
```

## 🎛️ Configuration Options

```
Environment Variables:
┌────────────────────────────────────────┐
│ OPENAI_API_KEY (optional)              │
│ ├─ If set: Real AI responses           │
│ └─ If not: Mock responses (FREE)       │
│                                        │
│ MONGODB_URI (required)                 │
│ └─ For user authentication             │
│                                        │
│ JWT_SECRET (required)                  │
│ └─ For token verification              │
└────────────────────────────────────────┘

Request Parameters:
┌────────────────────────────────────────┐
│ message (required)                     │
│ └─ String, max 4000 chars              │
│                                        │
│ model (optional)                       │
│ ├─ synapse-creative (default)          │
│ ├─ synapse-precision                   │
│ ├─ synapse-fast                        │
│ └─ synapse-code                        │
│                                        │
│ temperature (optional)                 │
│ └─ 0.0 to 1.0 (default: 0.7)          │
│    ├─ 0.0 = Deterministic              │
│    └─ 1.0 = Creative                   │
│                                        │
│ maxTokens (optional)                   │
│ └─ Max response length (default: 2000) │
│                                        │
│ conversationHistory (optional)         │
│ └─ Array of previous messages          │
└────────────────────────────────────────┘
```

## 🚦 Response Codes

```
┌───────┬─────────────────────────────────────┐
│  200  │ Success - Standard response         │
│  200  │ Success - Streaming started         │
├───────┼─────────────────────────────────────┤
│  400  │ Bad Request                         │
│       │ • Message too long (>4000 chars)    │
│       │ • History too long (>50 messages)   │
│       │ • Invalid input format              │
├───────┼─────────────────────────────────────┤
│  401  │ Unauthorized                        │
│       │ • No token provided                 │
│       │ • Invalid token                     │
│       │ • Expired token                     │
├───────┼─────────────────────────────────────┤
│  429  │ Rate Limited                        │
│       │ • Too many requests                 │
│       │ • Wait before trying again          │
├───────┼─────────────────────────────────────┤
│  500  │ Internal Server Error               │
│       │ • OpenAI API error                  │
│       │ • Database error                    │
│       │ • Unexpected error                  │
└───────┴─────────────────────────────────────┘
```

## 📈 Performance Characteristics

```
Response Times (with OpenAI):
┌────────────────────┬──────────┬──────────┐
│ Model              │ Standard │ Streaming│
├────────────────────┼──────────┼──────────┤
│ synapse-fast       │ 2-4s     │ 0.5s*    │
│ synapse-creative   │ 5-10s    │ 1-2s*    │
│ synapse-precision  │ 8-15s    │ 2-3s*    │
│ synapse-code       │ 5-12s    │ 1-2s*    │
└────────────────────┴──────────┴──────────┘
* Time to first token

Response Times (mock mode):
┌────────────────────┬──────────┬──────────┐
│ All Models         │ <100ms   │ 50ms*    │
└────────────────────┴──────────┴──────────┘
* Time to first token
```

---

This architecture provides:
- ✅ Scalable and secure
- ✅ Cost-effective (mock mode available)
- ✅ Real-time streaming
- ✅ Multiple AI models
- ✅ Project-specific rules
- ✅ Production-ready
