# 🔐 Google OAuth Setup Guide

## ✅ Migration Complete!

Google OAuth has been migrated from your old Express backend to **NextAuth.js** in Next.js.

---

## 📋 What You Need to Do

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Application type: **Web application**
7. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copy your **Client ID** and **Client Secret**

### 2. Update `.env.local`

Open `.env.local` and replace the placeholder values:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

**Generate NEXTAUTH_SECRET:**
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Restart Your Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 🎯 How It Works Now

### Frontend Flow:
1. User clicks **"Continue with Google"** button
2. NextAuth redirects to Google OAuth
3. User authorizes the app
4. Google redirects back to `/api/auth/callback/google`
5. Our callback handler:
   - Creates/updates user in MongoDB
   - Generates JWT token
   - Redirects to `/chat?token=xxx`
6. Chat page saves token to localStorage
7. User is logged in! 🎉

### Backend Routes:
- `/api/auth/[...nextauth]` - NextAuth handler (login, callback, session)
- `/api/auth/google/callback` - Custom callback to generate JWT

### Database Integration:
- Checks if user exists by email
- If user registered with password → links Google account
- If new user → creates account with `googleId`
- Google users are auto-verified (no email verification needed)

---

## 🔧 Files Created/Modified

**New Files:**
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `src/app/api/auth/google/callback/route.ts` - Custom callback handler
- `src/components/Providers.tsx` - SessionProvider wrapper
- `src/types/next-auth.d.ts` - TypeScript types

**Modified Files:**
- `src/components/auth/GoogleSignInButton.tsx` - Uses NextAuth `signIn()`
- `src/app/layout.tsx` - Added Providers wrapper
- `src/app/chat/page.tsx` - Handles token from OAuth callback
- `.env.local` - Added Google OAuth variables

---

## 🚨 Important Notes

### User Model Compatibility:
Your `User` model already supports Google OAuth:
```typescript
{
  email: string;
  password?: string;  // Optional for Google users
  googleId?: string;  // Google account ID
  verified: boolean;  // Auto-true for Google
}
```

### Existing Users:
- If user registered with email/password → Google account gets linked
- If user tries Google first → account created without password
- Both methods work for the same email address!

### Token Management:
- NextAuth manages OAuth sessions
- We generate our own JWT for API authentication
- Token stored in localStorage (same as before)

---

## 🧪 Testing

1. Make sure MongoDB is running
2. Start Next.js: `npm run dev`
3. Go to http://localhost:3000/login
4. Click **"Continue with Google"**
5. Authorize the app
6. You should land on `/chat` logged in!

---

## 🎓 For Your Professor

- ✅ NextAuth.js (official Next.js OAuth solution)
- ✅ No separate backend needed
- ✅ Integrated with existing MongoDB/JWT system
- ✅ TypeScript throughout
- ✅ Follows Next.js 13+ App Router patterns

---

**Questions?** Your Google OAuth is ready - just add your credentials! 🚀
