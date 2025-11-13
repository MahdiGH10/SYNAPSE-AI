# SynapseAI - Project Handover Guide

## 📋 Project Overview

**SynapseAI** is a modern full-stack AI chat application built with Next.js 14 and Node.js. This project combines cutting-edge frontend technologies with a robust backend to create an intelligent conversational AI platform.

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with modern animations
- **UI Components**: Custom React components with TypeScript
- **State Management**: Zustand for client-side state
- **Authentication**: Google OAuth integration

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google Strategy
- **Email**: Email verification system
- **Security**: JWT tokens, bcrypt password hashing

## 📁 Project Structure

```
SynapseAI/
├── frontend (Next.js app)
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── store/           # State management
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Express.js server
│   ├── config/             # Database & authentication config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── utils/              # Helper functions
└── documentation/          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account (for OAuth)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MahdiGH10/SYNAPSE-AI.git
   cd SYNAPSE-AI
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
   
   Create `.env` in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/synapseai
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

## 🎯 Key Features

### ✅ Implemented
- **User Authentication**: Google OAuth, email/password, email verification
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Animations**: Smooth transitions and interactive elements
- **Chat Interface**: Real-time chat UI components
- **Dashboard**: User dashboard with authentication checks
- **API Integration**: RESTful API with proper error handling
- **State Management**: Zustand stores for chat, theme, and workspace

### 🚧 In Development
- **AI Integration**: Connect to AI models (OpenAI, Anthropic, etc.)
- **Real-time Chat**: WebSocket implementation
- **File Uploads**: Document and image processing
- **Chat History**: Persistent conversation storage
- **User Profiles**: Enhanced user management

## 🔧 Development Workflow

### Running the Application
```bash
# Start both frontend and backend
npm run dev          # Frontend (port 3000)
cd backend && npm run dev  # Backend (port 5000)
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 📚 Documentation Files

1. **README.md** - Main project overview
2. **DEVELOPMENT_REPORT.md** - Detailed development progress
3. **ANIMATION_ENHANCEMENTS.md** - Animation implementation guide
4. **EXPERT_FEATURES.md** - Advanced features documentation
5. **QUICK_REFERENCE.md** - Developer quick reference
6. **backend/QUICKSTART.md** - Backend setup guide

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface
- **Dark/Light Themes**: Theme switching capability
- **Animations**: Smooth scroll animations and transitions
- **Responsive**: Works on all device sizes
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt for password security
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Server-side validation
- **Error Handling**: Comprehensive error management

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isEmailVerified: Boolean,
  googleId: String (optional),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/profile` - Get user profile
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

## 🚀 Deployment Ready

The application is configured for easy deployment to:
- **Vercel** (Frontend)
- **Heroku/Railway** (Backend)
- **MongoDB Atlas** (Database)

## 📱 Mobile Responsive

Fully responsive design tested on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔧 Technical Decisions

1. **Next.js 14**: Chose for App Router and React Server Components
2. **Tailwind CSS**: For rapid styling and consistency
3. **Zustand**: Lightweight state management solution
4. **Mongoose**: MongoDB ODM for better data modeling
5. **Passport.js**: Robust authentication middleware

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Commit with descriptive messages
4. Push and create a pull request

## 📞 Support

For questions or issues:
- Check existing documentation
- Review the codebase structure
- Test locally before deployment
- Use Git history for context on changes

---

**Project Status**: 🟢 Active Development
**Last Updated**: November 2024
**Primary Developer**: MahdiGH10

Good luck with the project! The foundation is solid and ready for AI integration. 🚀