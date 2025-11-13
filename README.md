# SynapseAI

A modern, full-stack AI chat application built with Next.js, TypeScript, Tailwind CSS, and Node.js. Features intelligent conversations, user authentication, and a beautiful responsive interface.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MahdiGH10/SYNAPSE-AI.git
cd SYNAPSE-AI

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start development servers
# Terminal 1 (Backend):
cd backend && npm run dev

# Terminal 2 (Frontend):
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Features

- **🤖 AI Chat Interface**: Intelligent conversation capabilities
- **🔐 Authentication**: Google OAuth + email/password authentication  
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop
- **🎨 Modern UI**: Clean design with smooth animations
- **⚡ Real-time**: Fast, interactive user experience
- **🔒 Secure**: JWT tokens, password hashing, email verification
- **📊 Dashboard**: User management and analytics

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Framer Motion** - Smooth animations

### Backend  
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **JWT** - Secure token-based authentication

## 📁 Project Structure

```
SynapseAI/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks  
│   ├── lib/             # Utility functions
│   └── store/           # State management (Zustand)
├── backend/
│   ├── config/          # Database & auth configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
└── public/              # Static assets
```

## 🔧 Environment Setup

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Create `backend/.env`:
```env
NODE_ENV=development  
PORT=5000
MONGODB_URI=mongodb://localhost:27017/synapseai
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript guides and reference  
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [MongoDB Documentation](https://docs.mongodb.com/) - database guides and tutorials

## 🚀 Deployment

The app is configured for easy deployment to:

- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean  
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email mahdi@synapseai.com or join our Discord community.

---

Built with ❤️ by [MahdiGH10](https://github.com/MahdiGH10)

- **Baseline**: 8pxYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **Scale**: Tailwind CSS spacing scale

## Deploy on Vercel

## 🚀 Getting Started

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Prerequisites

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd SynapseAI
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

Build the application for production:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

## 🧪 Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📂 Project Structure

```
SynapseAI/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx             # Landing page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── register/
│   │   │   └── page.tsx         # Register page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── Hero.tsx             # Hero section
│   │   ├── Features.tsx         # Features section
│   │   ├── FeatureCard.tsx      # Feature card component
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Layout.tsx           # Page layout wrapper
│   │   └── Icon.tsx             # SVG icon library
│   └── lib/
│       ├── animation.ts         # Framer Motion variants
│       ├── theme.ts             # Theme constants
│       └── data.ts              # Static data (features, links)
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
└── package.json                 # Dependencies and scripts
```

## 🎯 Components

### Core Components

- **Navbar**: Sticky navigation with mobile menu, smooth transitions
- **Hero**: Eye-catching hero section with animated background and CTAs
- **Features**: Grid of feature cards with hover effects
- **FeatureCard**: Reusable card with icon, title, and description
- **Footer**: Social links, navigation, and copyright
- **Layout**: Wrapper component for consistent page structure
- **Icon**: SVG icon library for all icons

### Pages

- **Home** (`/`): Landing page with hero and features
- **Login** (`/login`): Authentication page with glassmorphism card
- **Register** (`/register`): Registration page with form validation

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  navy: {
    DEFAULT: '#1E2A47',
    dark: '#141d33',
  },
  // ... add your colors
}
```

### Animations

Modify animation variants in `src/lib/animation.ts`:

```typescript
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
```

### Features

Update feature data in `src/lib/data.ts`:

```typescript
export const features: Feature[] = [
  {
    id: 1,
    title: 'Your Feature',
    description: 'Feature description',
    icon: 'icon-name',
  },
];
```

## ♿ Accessibility

- WCAG AA color contrast compliance
- Keyboard navigation support
- Focus-visible states on all interactive elements
- Semantic HTML structure
- ARIA labels where necessary
- Reduced motion support via `prefers-reduced-motion`

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Wide Desktop**: > 1280px

## 🔧 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Google Fonts (Inter, Poppins)
- **Linting**: ESLint

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by the SynapseAI Team
=======
# SYNAPSE-AI
PROJET NEXT JS
>>>>>>> b76cd372f74abd615f94ea5cc51ab9ed74145ef4
