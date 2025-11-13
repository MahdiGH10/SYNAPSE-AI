# 🚀 Quick Start Guide - SynapseAI Backend

Get your authentication server running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
notepad .env   # Windows
nano .env      # macOS/Linux
```

**Minimum required settings:**

```env
MONGO_URI=mongodb://localhost:27017/SynapseAI
JWT_SECRET=change_this_to_a_long_random_string_min_32_chars
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
FRONTEND_URL=http://localhost:3000
```

## Step 3: Start MongoDB

```bash
# Make sure MongoDB is running
mongod
```

## Step 4: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR production mode
npm start
```

**You should see:**

```
🚀 ========================================
   SynapseAI Backend Server
   ========================================
   Environment: development
   Server running on port 5000
   Health check: http://localhost:5000/health
   Frontend: http://localhost:3000
   ========================================

✅ MongoDB Connected: localhost
📊 Database: SynapseAI
```

## Step 5: Test It!

Open browser or use cURL:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {
#   "success": true,
#   "message": "SynapseAI Backend is running smoothly ✨"
# }
```

---

## 🔧 Gmail Setup (For Email Verification)

### Enable App Password:

1. Go to [Google Account](https://myaccount.google.com/security)
2. Turn on **2-Step Verification**
3. Go to **App passwords**
4. Select **Mail** and your device
5. Copy the **16-character password**
6. Paste it into `EMAIL_PASS` in `.env`

**Important:** Use the app password, NOT your regular Gmail password!

---

## 🔐 Google OAuth Setup (Optional)

### Get Credentials:

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Add redirect URI:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Copy **Client ID** and **Secret** to `.env`:

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

---

## ✅ Verify Everything Works

### Test Registration:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Account created successfully! Please check your email..."
}
```

### Check Email:

Look for verification email in your inbox (or spam folder).

### Test Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

---

## 🎯 Next Steps

1. **Frontend Integration**: Use the API endpoints from your Next.js app
2. **Customize Emails**: Edit templates in `utils/sendEmail.js`
3. **Add Features**: Extend with password reset, profile updates, etc.
4. **Deploy**: Follow deployment guide in main README

---

## 🐛 Common Issues

### "MongoDB connection failed"
→ Make sure `mongod` is running

### "Email not sending"
→ Check Gmail app password setup

### "Port 5000 already in use"
→ Change `PORT` in `.env` or stop other process

### "Cannot find module"
→ Run `npm install` again

---

## 📚 Documentation

Full API documentation: `README.md`

---

**Happy coding! 🚀**
