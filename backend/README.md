# SynapseAI Backend - Authentication System 🚀

A secure, production-ready authentication backend with email verification and Google OAuth 2.0.

## 🎯 Features

- ✅ **User Registration** with email verification
- ✅ **Secure Login** with JWT tokens (7-day expiry)
- ✅ **Google OAuth 2.0** - One-click sign-in
- ✅ **Email Verification** with beautiful HTML templates
- ✅ **Password Security** with bcrypt (12 salt rounds)
- ✅ **Rate Limiting** - Protection against brute force
- ✅ **Input Validation** with express-validator
- ✅ **Error Handling** - Consistent JSON responses
- ✅ **CORS & Helmet** - Production-grade security

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/SynapseAI

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=SynapseAI <noreply@synapseai.com>

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

### 3. Set Up Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Generate an **App Password** for "Mail"
4. Use that 16-character password in `EMAIL_PASS`

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Add authorized redirect URI:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Copy **Client ID** and **Client Secret** to `.env`

### 5. Start MongoDB

Make sure MongoDB is running locally:

```bash
# Windows
mongod

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 6. Start the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will run on **http://localhost:5000**

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### **Authentication Routes**

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully! Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "verified": false,
      "role": "user",
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  }
}
```

---

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful. Welcome back!",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "verified": true,
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (403) - Unverified:**
```json
{
  "success": false,
  "message": "Please verify your email address before logging in.",
  "requiresVerification": true
}
```

---

#### 3. Verify Email
```http
GET /api/auth/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now log in."
}
```

---

#### 4. Resend Verification Email
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox."
}
```

---

#### 5. Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "verified": true,
      "role": "user"
    }
  }
}
```

---

#### 6. Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### **Google OAuth Routes**

#### 7. Initiate Google Login
```http
GET /api/auth/google
```

Redirects user to Google consent screen.

#### 8. Google Callback (Automatic)
```http
GET /api/auth/google/callback
```

After successful Google authentication, redirects to:
```
http://localhost:3000/auth/google/success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Frontend should extract token from URL and store it.

---

## 🔐 Security Features

### 1. **Password Hashing**
- bcrypt with 12 salt rounds
- Passwords never stored in plain text

### 2. **JWT Tokens**
- 7-day expiry by default
- Signed with secret key
- Stateless authentication

### 3. **Rate Limiting**
- 100 requests per 15 minutes (general)
- 20 requests per 15 minutes (auth routes)

### 4. **Input Validation**
- Email format validation
- Password strength: min 8 chars, uppercase, lowercase, number
- Sanitization of all inputs

### 5. **CORS**
- Restricted to frontend URL only
- Credentials support enabled

### 6. **Helmet**
- Security headers automatically set
- Protection against common vulnerabilities

---

## 🎨 Frontend Integration

### 1. Register Flow

```javascript
// Register new user
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();

if (data.success) {
  // Show success message: "Check your email to verify"
  // Redirect to login or verification pending page
}
```

### 2. Email Verification Flow

User clicks link in email → Frontend route `/verify?token=xxx`

```javascript
// Extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Verify email
const response = await fetch(`http://localhost:5000/api/auth/verify?token=${token}`);
const data = await response.json();

if (data.success) {
  // Show success message
  // Redirect to login page
}
```

### 3. Login Flow

```javascript
// Login user
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const data = await response.json();

if (data.success) {
  // Store token in localStorage or httpOnly cookie
  localStorage.setItem('token', data.data.token);
  
  // Store user info
  localStorage.setItem('user', JSON.stringify(data.data.user));
  
  // Redirect to dashboard
  window.location.href = '/dashboard';
}
```

### 4. Google Login Flow

```javascript
// Redirect to Google OAuth
window.location.href = 'http://localhost:5000/api/auth/google';

// After successful auth, Google redirects to:
// http://localhost:3000/auth/google/success?token=xxx

// Extract and store token
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  localStorage.setItem('token', token);
  // Fetch user profile with token
  // Redirect to dashboard
}
```

### 5. Protected Routes

```javascript
// Add token to requests
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const data = await response.json();

if (data.success) {
  // User is authenticated
  console.log(data.data.user);
} else {
  // Token invalid or expired - redirect to login
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'

# Get current user (replace TOKEN)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import collection or create requests manually
2. For protected routes, add header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── passport.js           # Google OAuth config
├── controllers/
│   ├── authController.js     # Auth logic (register, login, verify)
│   └── googleController.js   # Google OAuth callbacks
├── middleware/
│   ├── authMiddleware.js     # JWT verification, role checks
│   └── errorHandler.js       # Global error handling
├── models/
│   └── User.js              # User schema with methods
├── routes/
│   ├── auth.js              # Auth routes
│   └── googleAuth.js        # Google OAuth routes
├── utils/
│   ├── sendEmail.js         # Email sending logic
│   └── tokenUtils.js        # JWT generation & verification
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main server file
```

---

## 🚀 Deployment Tips

### 1. **Production Environment Variables**
- Use strong `JWT_SECRET` (64+ random characters)
- Set `NODE_ENV=production`
- Use production MongoDB URI (MongoDB Atlas)

### 2. **HTTPS Required**
- Google OAuth requires HTTPS in production
- Use Let's Encrypt or cloud provider SSL

### 3. **Environment-Specific Configs**
```javascript
// In production
FRONTEND_URL=https://synapseai.com
GOOGLE_CALLBACK_URL=https://api.synapseai.com/api/auth/google/callback
```

---

## 📧 Email Templates

Beautiful, branded emails are sent for:
1. **Verification Email** - Purple gradient design with CTA button
2. **Password Reset** - Clean warning-style layout

Emails include:
- Responsive HTML design
- Fallback plain text
- Security warnings
- Expiration notices

---

## ⚡ Performance & Scalability

- **Stateless JWT** - No session storage needed
- **MongoDB Indexing** - Email field indexed for fast lookups
- **Rate Limiting** - Prevents abuse
- **Async/Await** - Non-blocking operations
- **Error Handling** - Graceful degradation

---

## 🛡️ Security Checklist

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with expiration
- ✅ Input validation & sanitization
- ✅ Rate limiting on all routes
- ✅ CORS restricted to frontend domain
- ✅ Helmet security headers
- ✅ Environment variables for secrets
- ✅ No passwords in error messages
- ✅ Email verification required
- ✅ Protected routes middleware

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/SynapseAI
```

### Email Not Sending
```bash
# Verify Gmail settings:
1. 2-Step Verification enabled
2. App Password generated (not regular password)
3. Correct EMAIL_USER and EMAIL_PASS in .env
```

### Google OAuth Error
```bash
# Check:
1. Correct CLIENT_ID and CLIENT_SECRET
2. Authorized redirect URI matches exactly
3. Google+ API enabled in console
```

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

---

## 👨‍💻 Author

**SynapseAI Team**

Built with ❤️ for modern, human-centered authentication.

---

## 📄 License

MIT License - Feel free to use this in your projects!
