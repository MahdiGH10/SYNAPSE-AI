# SynapseAI - Intelligent Assistant Landing PageThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern, fully responsive landing page for SynapseAI built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Features smooth animations, glassmorphism design, and accessibility-first development.## Getting Started



## ✨ FeaturesFirst, run the development server:



- **Modern Design**: Clean, minimalist design with glassmorphism effects```bash

- **Fully Responsive**: Optimized for mobile, tablet, and desktopnpm run dev

- **Smooth Animations**: Powered by Framer Motion with reduced-motion support# or

- **Accessibility First**: WCAG AA compliant with keyboard navigationyarn dev

- **TypeScript**: Full type safety throughout the project# or

- **Component-Based**: Reusable, modular React componentspnpm dev

- **Performance Optimized**: Fast loading with Next.js optimizations# or

bun dev

## 🎨 Design System```



### ColorsOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Deep Navy**: `#1E2A47` (primary background/header)

- **Soft Blue**: `#4F6DFF` (primary CTA/accents)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Surface White**: `#F8FAFF` (cards, text background)

- **Gradient Accent**: `linear-gradient(90deg, #5B7FFF 0%, #9E62FF 100%)`This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Neutral Gray**: `#6B7280` (text)

## Learn More

### Typography

- **Primary Font**: InterTo learn more about Next.js, take a look at the following resources:

- **Display Font**: Poppins

- **Font Display**: swap (for performance)- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Spacing

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
