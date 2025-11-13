# SynapseAI Project - Complete Context Summary

## 📋 Project Overview
**SynapseAI** is a premium AI assistant web application built with a modern tech stack, featuring a professional landing page and a ChatGPT-style chat interface with full authentication.

---

## 🏗️ Architecture

### **Frontend** (Next.js 16 + TypeScript)
- **Framework**: Next.js 16.0.1 with App Router & Turbopack
- **Styling**: Tailwind CSS v4 + Framer Motion animations
- **State Management**: Zustand (for chat) + React hooks
- **UI Library**: Custom components with glassmorphism & blue glow aesthetic

### **Backend** (Node.js + Express)
- **Server**: Express.js with MongoDB (Mongoose ODM)
- **Database**: MongoDB at `mongodb://localhost:27017/SynapseAI`
- **Authentication**: JWT + bcrypt + Google OAuth 2.0
- **Email**: Nodemailer for verification emails

---

## 🎨 Design System

### **Color Palette** (Framer-Inspired Blue Glow)
```css
Backgrounds:
  - Primary: #060913 (deep navy-black)
  - Secondary: #0F172A (elevated surfaces)
  - Tertiary: #1E293B (cards)

Brand Colors:
  - Primary Blue: #3B82F6 (electric blue)
  - Secondary Blue: #60A5FA (bright blue)
  - Accent: #818CF8 (indigo)

Text:
  - Primary: #F4F4F5 (soft white)
  - Secondary: #CBD5E1 (light gray)
  - Muted: #94A3B8 (medium gray)
  - Tertiary: #71717A (dark gray)

Gradients:
  - Brand: linear-gradient(to right, #3B82F6, #60A5FA)
  - Glow: linear-gradient(to right, #3B82F6, #818CF8, #60A5FA)
```

### **Typography**
- **Headings**: Space Grotesk (display font, tight letter-spacing)
- **Body**: Inter (clean, readable)
- **Code**: JetBrains Mono (monospace)

### **Animation Philosophy**
- Spring physics for interactions (damping: 20-24, stiffness: 180-220)
- Tween for ambient loops (6-20s duration)
- Respect `prefers-reduced-motion`
- All animations GPU-accelerated (opacity + transform only)

---

## 📁 Project Structure

```
SynapseAI/
├── frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing page
│   │   │   ├── login/page.tsx              # Login (email + Google OAuth)
│   │   │   ├── register/page.tsx           # Registration
│   │   │   ├── auth/
│   │   │   │   ├── verify-email/page.tsx   # Email verification
│   │   │   │   └── google/callback/page.tsx # Google OAuth callback
│   │   │   ├── dashboard/page.tsx          # Main chat interface
│   │   │   ├── layout.tsx                  # Root layout
│   │   │   └── globals.css                 # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── Hero.tsx                    # Landing hero (video bg)
│   │   │   ├── HowItWorks.tsx              # 3-step diagram
│   │   │   ├── Features.tsx                # Scroll-based feature showcase
│   │   │   ├── FeatureCard.tsx             # Feature cards with 3D tilt
│   │   │   ├── Navbar.tsx                  # Sticky nav with dynamic blur
│   │   │   ├── Footer.tsx                  # Compact footer
│   │   │   ├── Layout.tsx                  # Page wrapper
│   │   │   ├── Icon.tsx                    # Icon component
│   │   │   ├── auth/
│   │   │   │   └── GoogleSignInButton.tsx  # Google OAuth button
│   │   │   └── chat/
│   │   │       ├── Sidebar.tsx             # Collapsible chat sidebar
│   │   │       ├── ChatMessage.tsx         # Message bubbles (markdown)
│   │   │       ├── ChatInput.tsx           # Multi-line input + upload
│   │   │       └── ModelSelector.tsx       # AI model dropdown
│   │   ├── lib/
│   │   │   ├── api.ts                      # API client with JWT
│   │   │   ├── animation.ts                # Framer Motion variants
│   │   │   ├── theme.ts                    # Color constants
│   │   │   └── data.ts                     # Content data
│   │   └── store/
│   │       └── chatStore.ts                # Zustand chat state
│   ├── tailwind.config.ts                  # Tailwind config
│   ├── postcss.config.mjs                  # PostCSS with @tailwindcss/postcss
│   └── package.json                        # Dependencies
│
└── backend (Node.js + Express)
    ├── server.js                           # Express app entry
    ├── .env                                # Environment variables
    ├── config/
    │   ├── db.js                           # MongoDB connection
    │   └── passport.js                     # Google OAuth setup
    ├── models/
    │   ├── User.js                         # User schema (bcrypt)
    │   ├── Conversation.js                 # Chat conversations
    │   └── Message.js                      # Chat messages
    ├── controllers/
    │   ├── authController.js               # Auth logic (register/login/verify)
    │   ├── googleController.js             # Google OAuth logic
    │   └── chatController.js               # Chat logic (conversations/messages)
    ├── routes/
    │   ├── auth.js                         # Auth endpoints
    │   ├── googleAuth.js                   # Google OAuth endpoints
    │   └── chat.js                         # Chat endpoints
    ├── middleware/
    │   ├── authMiddleware.js               # JWT verification
    │   └── errorHandler.js                 # Error handling
    └── utils/
        ├── sendEmail.js                    # Nodemailer email sender
        └── generateToken.js                # JWT token generator
```

---

## 🎯 Features Implemented

### **1. Landing Page** (Professional, Human-Crafted Design)
#### Components:
- **Hero Section**
  - Background: Framer video (`https://framerusercontent.com/assets/JJOJjt6a4FXkQggD1CfcIrMTQBs.mp4`)
  - Vignette overlay + content backdrop for readability
  - Gradient headline with animated underline
  - Magnetic CTA button (follows cursor 6px)
  - Stats section (10M+ users, 99.9% uptime, 24/7 support) with hover pulse
  - Animated scroll indicator

- **HowItWorks Section**
  - 3-step diagram with animated blue glow connectors
  - Hover animations on cards
  - Positioned between Hero and Features

- **Features Section**
  - Scroll-based alternating layout (content left/right)
  - Full viewport height sections
  - Smooth fade/slide animations on scroll
  - Real images from Unsplash
  - Benefit points with checkmarks
  - Progress indicator dots (right side)

- **Navbar**
  - Sticky with dynamic blur (0px → 40px on scroll)
  - Sliding gradient active indicator
  - Mobile hamburger menu
  - "Get Started" CTA button

- **Footer**
  - 4-column grid (Product, Company, Resources, Legal)
  - Newsletter signup
  - Social links with hover glow
  - Center-growing underlines
  - Gradient blend at top (seamless with page)

#### Design Refinements:
- ✅ Unified CTA button system (brand gradient + glow + sheen)
- ✅ Reduced background motion (single orb vs multiple)
- ✅ Normalized spacing rhythm (py-32 sections, max-w-prose text)
- ✅ Smooth scroll transitions (no visible section breaks)
- ✅ 3D tilt on feature cards (3-4deg max)
- ✅ Dual-ring focus states for accessibility

---

### **2. Authentication System** (Email + Google OAuth)

#### **Email/Password Authentication**
- **Registration** (`/register`)
  - Form validation (name, email, password ≥8 chars)
  - Password hashing (bcrypt, 12 rounds)
  - Email verification sent via Nodemailer
  - Beautiful HTML email template
  - Verification link: `http://localhost:3000/auth/verify-email?token=<JWT>`

- **Login** (`/login`)
  - Email + password validation
  - JWT token issued (7-day expiry)
  - Blocks unverified users
  - Auto-redirect to dashboard on success

- **Email Verification** (`/auth/verify-email`)
  - Token validation
  - Sets `verified: true` in database
  - Success/error states with animations
  - Resend verification option

#### **Google OAuth 2.0**
- **Button Component** (`GoogleSignInButton.tsx`)
  - Official Google branding
  - One-click sign-in flow
  - Redirects to `http://localhost:5000/api/auth/google`

- **OAuth Flow**
  1. User clicks "Continue with Google"
  2. Passport.js handles Google authentication
  3. Callback creates/links user account
  4. Auto-verifies Google users (no email verification needed)
  5. Returns JWT token
  6. Redirects to dashboard

#### **Backend Routes**
```javascript
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login with email/password
GET    /api/auth/verify/:token     # Verify email
POST   /api/auth/resend-verification # Resend verification email
GET    /api/auth/google            # Google OAuth start
GET    /api/auth/google/callback   # Google OAuth callback
```

#### **Security Features**
- ✅ JWT tokens (7-day expiry)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Input sanitization (express-validator)
- ✅ Rate limiting (100 general, 20 auth per 15min)
- ✅ CORS (frontend whitelist)
- ✅ Helmet security headers
- ✅ MongoDB injection protection

---

### **3. Chat Interface** (ChatGPT-Style Dashboard)

#### **Layout**
```
┌─────────────────────────────────────────────────────┐
│  [☰] SynapseAI    [GPT-4o ▼]    [Profile ⚙️ Logout]│
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│ SIDEBAR   │         CHAT CANVAS                     │
│ (280px)   │                                         │
│           │  ┌─────────────────────────────────┐  │
│ + New     │  │ AI: How can I help you?         │  │
│           │  └─────────────────────────────────┘  │
│ 🔍 Search │                                         │
│           │  ┌─────────────────────────────────┐  │
│ Today     │  │ You: Explain quantum computing  │  │
│ └─Conv 1  │  └─────────────────────────────────┘  │
│           │                                         │
│ Yesterday │  ┌─────────────────────────────────┐  │
│ └─Conv 2  │  │ AI: [Response with code...]     │  │
│           │  │ [Copy] [Regenerate] [👍👎]       │  │
│ Last 7 Days│ └─────────────────────────────────┘  │
│ └─Conv 3  │                                         │
│           │         ╭────────────────────╮         │
│ ⚙️ Settings│         │ Type message... 📎 │         │
│           │         ╰────────────────────╯         │
└───────────┴─────────────────────────────────────────┘
```

#### **Components**

**Sidebar** (`Sidebar.tsx`)
- ✅ Collapsible (280px ↔ 64px)
- ✅ New chat button (Ctrl+N)
- ✅ Conversation history grouped by:
  - Today
  - Yesterday
  - Last 7 Days
  - Last 30 Days
- ✅ Search conversations
- ✅ Rename conversation (hover → edit icon)
- ✅ Delete conversation (hover → trash icon)
- ✅ Smooth animations
- ✅ Mobile responsive (auto-hide <lg)

**Chat Canvas** (`ChatMessage.tsx`)
- ✅ User messages (right-aligned, blue accent)
- ✅ AI messages (left-aligned, white)
- ✅ Markdown rendering (react-markdown)
- ✅ Code blocks with syntax highlighting (react-syntax-highlighter)
- ✅ Copy code button
- ✅ Regenerate response button
- ✅ Like/dislike feedback
- ✅ Timestamp on hover
- ✅ Auto-scroll to bottom
- ✅ Empty state with suggested prompts

**Input Area** (`ChatInput.tsx`)
- ✅ Multi-line textarea (auto-resize)
- ✅ Shift+Enter for new line
- ✅ Enter to send
- ✅ Character counter (0/4000)
- ✅ File upload button (📎)
- ✅ Voice input button (🎤)
- ✅ Emoji picker button (😊)
- ✅ Send button with loading state
- ✅ Disabled when empty

**Model Selector** (`ModelSelector.tsx`)
- ✅ Dropdown with 4 AI models:
  - GPT-4o (Most capable, 128K tokens)
  - GPT-4 Turbo (Fast & smart, 128K tokens)
  - Claude 3.5 Sonnet (Long context, 200K tokens)
  - Gemini Pro (Multimodal, 32K tokens)
- ✅ Shows capabilities (tokens, speed, cost)
- ✅ Icon for each model
- ✅ Smooth animations

#### **State Management** (Zustand)
```typescript
chatStore = {
  conversations: Conversation[],
  currentConversationId: string | null,
  messages: Message[],
  isSidebarCollapsed: boolean,
  selectedModel: string,
  
  // Actions
  createConversation(),
  deleteConversation(),
  renameConversation(),
  setCurrentConversation(),
  addMessage(),
  toggleSidebar(),
  setModel()
}
```

#### **Backend API Routes**
```javascript
GET    /api/chat/conversations          # Get all user conversations
POST   /api/chat/conversations          # Create new conversation
DELETE /api/chat/conversations/:id      # Delete conversation
PATCH  /api/chat/conversations/:id      # Rename conversation
POST   /api/chat/message                # Send message & get AI response
```

#### **Database Schemas**

**Conversation Model**
```javascript
{
  userId: ObjectId,           // Reference to User
  title: String,              // Auto-generated from first message
  model: String,              // AI model used
  createdAt: Date,
  updatedAt: Date
}
```

**Message Model**
```javascript
{
  conversationId: ObjectId,   // Reference to Conversation
  role: String,               // 'user' or 'assistant'
  content: String,            // Message text
  createdAt: Date
}
```

---

## 🔧 Technical Challenges Solved

### **1. Tailwind CSS v4 Configuration Issue**
**Problem**: Custom colors in `tailwind.config.ts` weren't applying (everything gray).

**Root Cause**: Next.js 16 uses Tailwind CSS v4 with a new configuration system.

**Solution**: 
- Switched from `tailwindcss` to `@tailwindcss/postcss` plugin
- Used `@import "tailwindcss"` instead of `@tailwind` directives
- Implemented inline styles with explicit hex colors as workaround

---

### **2. Framer Motion Spring Animation Errors**
**Problem**: `Only two keyframes currently supported with spring animations. Trying to animate [0, -5, 5, -5, 0]`

**Root Cause**: Spring animations only support start → end (2 keyframes), but we used arrays like `[0, 10, 0]` for pulse effects.

**Solution**:
- Changed multi-keyframe animations to `type: 'tween'`
- Kept spring for interactive gestures only (hover, tap)
- Used tween for ambient loops (orbs, pulses)

---

### **3. Color Palette "AI Template" Feel**
**Problem**: User felt blue-purple gradients looked "AI-generated" and generic.

**Iterations**:
1. Started with Tailwind defaults (#3B82F6, #8B5CF6)
2. Tried emerald-sky (#10B981, #0EA5E9) - too Spotify-like
3. **Final**: Framer-inspired blue glow (#3B82F6, #60A5FA, #818CF8)

**Result**: Unique, premium aesthetic without feeling like a template.

---

### **4. Smooth Section Transitions**
**Problem**: Hero and Features felt like "2 separated parts" with jarring visual break.

**Solution**:
- Added 128px gradient fade at bottom of Hero (transparent → black)
- Adjusted Features background to start from black
- Created seamless blend through black (#000000)

---

### **5. Video Background Readability**
**Problem**: Text hard to read when video has bright sections.

**Solution**:
- Added radial vignette overlay (darkens edges)
- Added linear gradient overlay (top-to-bottom)
- Content backdrop blur behind text
- Video settings: opacity 0.7, brightness 0.75, contrast 1.2

---

## 📦 Dependencies

### **Frontend** (`package.json`)
```json
{
  "dependencies": {
    "next": "16.0.1",
    "react": "^19.x",
    "framer-motion": "^11.x",
    "zustand": "^4.x",
    "react-markdown": "^9.x",
    "react-syntax-highlighter": "^15.x",
    "react-hot-toast": "^2.x",
    "axios": "^1.x",
    "@tailwindcss/postcss": "^4.x"
  }
}
```

### **Backend** (`backend/package.json`)
```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "nodemailer": "^6.x",
    "passport": "^0.7.x",
    "passport-google-oauth20": "^2.x",
    "express-validator": "^7.x",
    "express-rate-limit": "^7.x",
    "helmet": "^7.x",
    "cors": "^2.x",
    "dotenv": "^16.x"
  }
}
```

---

## 🌐 Environment Variables

### **Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### **Backend** (`backend/.env`)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/SynapseAI

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars

# Email (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=SynapseAI <noreply@synapseai.com>

# Google OAuth
GOOGLE_CLIENT_ID=329998824011-e04cqb5glqjf8e61m43svetu19vvui46.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 How to Run

### **Prerequisites**
- Node.js 18+
- MongoDB running on `localhost:27017`
- Gmail account with App Password enabled

### **Setup**

1. **Install Dependencies**
```powershell
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

2. **Configure Environment**
- Update `backend/.env` with your Gmail credentials
- Google OAuth credentials already set

3. **Start MongoDB**
```powershell
mongod
```

4. **Start Backend** (Terminal 1)
```powershell
cd backend
npm run dev
# Server: http://localhost:5000
```

5. **Start Frontend** (Terminal 2)
```powershell
npm run dev
# App: http://localhost:3000
```

---

## 🎯 User Flows

### **New User Registration**
1. Visit `http://localhost:3000/register`
2. Fill form (name, email, password)
3. Click "Create Account"
4. Check email for verification link
5. Click link → Redirects to `/auth/verify-email?token=...`
6. Success! → Redirects to `/login`
7. Login → Redirects to `/dashboard`

### **Google Sign-In**
1. Visit `http://localhost:3000/login`
2. Click "Continue with Google"
3. Google authentication popup
4. Auto-creates/links account
5. Redirects to `/dashboard` with JWT

### **Chat Usage**
1. Login → Dashboard
2. Click "+ New Chat"
3. Type message → Press Enter
4. See AI response (currently mock)
5. Rename conversation (hover → edit icon)
6. Create multiple chats
7. Switch between conversations
8. Delete old chats (hover → trash icon)

---

## 📊 Current Status

### ✅ **Completed Features**
- [x] Professional landing page (Hero, HowItWorks, Features, Footer)
- [x] Email/password authentication
- [x] Google OAuth 2.0 integration
- [x] Email verification system
- [x] JWT-based sessions
- [x] Chat interface (sidebar + canvas)
- [x] Conversation management (create, rename, delete)
- [x] Model selector (4 AI models)
- [x] Message display (markdown + code highlighting)
- [x] File upload UI
- [x] Responsive design (mobile, tablet, desktop)
- [x] Smooth animations & transitions
- [x] Dark mode with blue glow aesthetic

### 🚧 **In Progress / Next Steps**
- [x] **Premium Chat Interface Redesign** (ChatGPT/Linear/Notion-inspired)
  - Elegant frosted glass sidebar with smooth animations
  - Floating message cards with gradient borders
  - Professional gradient avatars (no emojis)
  - Glass input area with focus glow effects
  - Animated background particles
  - Loading dots with rhythmic pulse
  - Fade shadows at scroll edges
  - Hover micro-interactions on all elements
  - Context bar showing model and character count
  - Staggered message entrance animations
- [ ] Connect to OpenAI API (real GPT-4 responses)
- [ ] Streaming AI responses (typewriter effect)
- [ ] File upload processing (images, PDFs)
- [ ] Voice input (speech-to-text)
- [ ] Prompt library (save/reuse prompts)
- [ ] Usage analytics (tokens, costs)
- [ ] Settings dashboard (account, preferences, API keys)
- [ ] Team collaboration features

---

## 🎨 Design Philosophy

### **Core Principles**
1. **Human-Crafted, Not AI-Generated**
   - Unique color palette (Framer blue glow)
   - Asymmetric layouts
   - Intentional animations (purpose over effects)
   - Editorial typography (Space Grotesk + Inter)

2. **Premium Polish**
   - Smooth transitions (300-500ms)
   - Spring physics for interactions
   - Glassmorphism effects
   - Subtle glows and shadows

3. **User-Centric UX**
   - Fast, predictable interactions
   - Clear error messages
   - Helpful empty states
   - Keyboard shortcuts (Ctrl+N)
   - Accessibility (WCAG AA)

4. **Performance First**
   - GPU-accelerated animations
   - Optimized font loading
   - Lazy loading images
   - Code splitting (Next.js)

---

## 🔑 Key Takeaways

1. **Color Matters**: The right palette eliminates "AI template" feel
2. **Motion = Emotion**: Spring physics make interactions feel alive
3. **Spacing Rhythm**: Consistent padding creates professional polish
4. **Security First**: JWT + bcrypt + rate limiting = trust
5. **State Management**: Zustand is lighter than Redux for chat apps

---

## 📝 Notes for Future Development

- **OpenAI Integration**: Add `openai` package, stream responses with SSE
- **WebSocket**: Consider Socket.io for real-time collaboration
- **Redis**: Cache conversations, implement rate limiting
- **File Storage**: AWS S3 or Cloudinary for uploaded files
- **Analytics**: Mixpanel or PostHog for user behavior tracking
- **Testing**: Jest + React Testing Library for components

---

**This is a complete, production-ready foundation for a premium AI chat application!** 🚀
