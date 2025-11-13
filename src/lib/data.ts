// Feature data for the landing page

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  detailedDescription: string;
  benefits: string[];
  image: string;
}

export const features: Feature[] = [
  {
    id: 1,
    title: 'Intelligent Chat Assistant',
    description: 'Engage in natural conversations with our advanced AI assistant',
    icon: 'chat',
    detailedDescription: 'Experience seamless conversations with our state-of-the-art AI that understands context, remembers your preferences, and provides intelligent responses tailored to your needs.',
    benefits: [
      'Natural language understanding',
      'Context-aware responses',
      'Multi-language support',
      'Real-time processing'
    ],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Advanced File Analysis',
    description: 'Upload and analyze documents with intelligent insights',
    icon: 'file',
    detailedDescription: 'Transform your documents into actionable insights. Our AI analyzes PDFs, spreadsheets, and text files to extract key information, identify patterns, and generate comprehensive summaries.',
    benefits: [
      'Support for 50+ file formats',
      'Instant data extraction',
      'Automated summarization',
      'Pattern recognition'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Real-Time Analytics',
    description: 'Get real-time analytics and actionable recommendations',
    icon: 'insights',
    detailedDescription: 'Make data-driven decisions with confidence. Our analytics engine processes millions of data points to deliver insights that matter, presented in beautiful, easy-to-understand visualizations.',
    benefits: [
      'Live data processing',
      'Predictive analytics',
      'Custom dashboards',
      'Automated reporting'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Enterprise Security',
    description: 'Enterprise-grade security keeps your information protected',
    icon: 'security',
    detailedDescription: 'Your data security is our top priority. We employ military-grade encryption, regular security audits, and comply with international data protection standards to keep your information safe.',
    benefits: [
      'End-to-end encryption',
      'SOC 2 Type II certified',
      'GDPR compliant',
      '99.99% uptime SLA'
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&q=80'
  },
];

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
];

export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export interface ChatModelOption {
  id: 'synapse-creative' | 'synapse-precision' | 'synapse-lite';
  label: string;
  tagline: string;
  description: string;
  tokens: string;
}

export const chatModels: ChatModelOption[] = [
  {
    id: 'synapse-creative',
    label: 'Synapse Creative',
    tagline: 'Best for brainstorming & exploration',
    description: 'Multimodal flagship with nuanced reasoning, deep context window, and rich creativity controls.',
    tokens: '200K ctx · 4 tools',
  },
  {
    id: 'synapse-precision',
    label: 'Synapse Precision',
    tagline: 'Accurate, factual, grounded responses',
    description: 'Optimized for analytical tasks, technical documentation, and enterprise-guardrailed outputs.',
    tokens: '120K ctx · 2 tools',
  },
  {
    id: 'synapse-lite',
    label: 'Synapse Lite',
    tagline: 'Fast answers with lightweight memory',
    description: 'Latency-optimized variant perfect for quick follow-ups, support flows, and mobile usage.',
    tokens: '60K ctx · 1 tool',
  },
];

export interface SlashCommand {
  command: string;
  label: string;
  description: string;
  shortcut?: string;
}

export const slashCommands: SlashCommand[] = [
  {
    command: '/summarize',
    label: 'Summarize',
    description: 'Provide a concise summary of the selected text or conversation.',
    shortcut: '⌘ + ⇧ + S',
  },
  {
    command: '/analyze',
    label: 'Analyze',
    description: 'Run an in-depth analysis on code snippets, data, or uploaded files.',
    shortcut: '⌘ + ⇧ + A',
  },
  {
    command: '/improve',
    label: 'Improve tone',
    description: 'Rewrite the selected passage with clearer, more confident language.',
  },
  {
    command: '/tasks',
    label: 'Plan tasks',
    description: 'Break down your goals into actionable steps with owners and deadlines.',
  },
  {
    command: '/memory',
    label: 'Add to memory',
    description: 'Store long-term preferences or project context for future conversations.',
  },
];
