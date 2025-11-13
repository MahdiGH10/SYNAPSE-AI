import { NextResponse } from 'next/server';

export async function GET() {
  const features = [
    {
      id: 1,
      title: 'Chat with AI',
      description: 'Engage in natural conversations with our advanced AI assistant',
      icon: 'chat',
      details: {
        capabilities: [
          'Natural language understanding',
          'Context-aware responses',
          'Multi-language support',
        ],
        availability: '24/7',
      },
    },
    {
      id: 2,
      title: 'File Analysis',
      description: 'Upload and analyze documents with intelligent insights',
      icon: 'file',
      details: {
        capabilities: [
          'Document parsing',
          'Data extraction',
          'Sentiment analysis',
        ],
        supportedFormats: ['PDF', 'DOCX', 'TXT', 'CSV'],
      },
    },
    {
      id: 3,
      title: 'Instant Insights',
      description: 'Get real-time analytics and actionable recommendations',
      icon: 'insights',
      details: {
        capabilities: [
          'Real-time processing',
          'Predictive analytics',
          'Trend detection',
        ],
        refreshRate: 'Real-time',
      },
    },
    {
      id: 4,
      title: 'Secure Data',
      description: 'Enterprise-grade security keeps your information protected',
      icon: 'security',
      details: {
        capabilities: [
          'End-to-end encryption',
          'GDPR compliant',
          'Regular security audits',
        ],
        certifications: ['ISO 27001', 'SOC 2 Type II'],
      },
    },
  ];

  return NextResponse.json({
    success: true,
    data: features,
    meta: {
      total: features.length,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
}
