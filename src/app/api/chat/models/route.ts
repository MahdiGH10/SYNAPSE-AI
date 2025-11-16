import { NextResponse } from 'next/server';

// Available AI models for SynapseAI
export async function GET() {
  const models = [
    {
      id: 'synapse-creative',
      name: 'Synapse Creative',
      provider: 'huggingface',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      description: 'Best for brainstorming, creative writing, and exploration',
      capabilities: [
        'Creative content generation',
        'Brainstorming and ideation',
        'Complex reasoning',
        'Multi-turn conversations',
        'Advanced language understanding',
      ],
      contextWindow: 32768,
      maxTokens: 8192,
      pricing: {
        input: 0.0,
        output: 0.0,
      },
      speed: 'medium',
      recommended: ['creative-writing', 'brainstorming', 'complex-analysis'],
    },
    {
      id: 'synapse-precision',
      name: 'Synapse Precision',
      provider: 'huggingface',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      description: 'Most accurate for technical tasks, coding, and analysis',
      capabilities: [
        'Advanced code generation',
        'Technical documentation',
        'Data analysis',
        'Scientific reasoning',
        'Long context understanding',
      ],
      contextWindow: 32768,
      maxTokens: 8192,
      pricing: {
        input: 0.0,
        output: 0.0,
      },
      speed: 'medium',
      recommended: ['coding', 'technical-writing', 'data-analysis'],
    },
    {
      id: 'synapse-fast',
      name: 'Synapse Fast',
      provider: 'huggingface',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      description: 'Quick responses for simple queries and conversations',
      capabilities: [
        'Quick Q&A',
        'Simple tasks',
        'Basic coding help',
        'General conversation',
        'Fast processing',
      ],
      contextWindow: 32768,
      maxTokens: 8192,
      pricing: {
        input: 0.0,
        output: 0.0,
      },
      speed: 'medium',
      recommended: ['quick-answers', 'simple-tasks', 'chat'],
    },
    {
      id: 'synapse-code',
      name: 'Synapse Code',
      provider: 'huggingface',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      description: 'Specialized for code generation, debugging, and review',
      capabilities: [
        'Code generation',
        'Bug detection and fixing',
        'Code review',
        'Architecture suggestions',
        'Multi-language support',
      ],
      contextWindow: 32768,
      maxTokens: 8192,
      pricing: {
        input: 0.0,
        output: 0.0,
      },
      speed: 'medium',
      recommended: ['coding', 'debugging', 'code-review'],
    },
  ];

  return NextResponse.json({
    success: true,
    data: models,
    meta: {
      total: models.length,
      default: 'synapse-creative',
      timestamp: new Date().toISOString(),
    },
  });
}
