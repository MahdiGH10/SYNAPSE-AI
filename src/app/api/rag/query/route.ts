import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, category } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question required' }, { status: 400 });
    }

    // Step 1: Get relevant context from RAG service
    const ragResponse = await fetch(`${RAG_SERVICE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, category }),
    });

    if (!ragResponse.ok) {
      throw new Error('RAG service query error');
    }

    const ragData = await ragResponse.json();

    if (!ragData.success) {
      return NextResponse.json({
        success: false,
        answer: "No relevant information found.",
        sources: []
      });
    }

    // Step 2: Build category-aware prompt
    const categoryPrompts: Record<string, string> = {
      'Technical Reports': 'You are a technical expert. Explain concepts clearly with examples.',
      'Financial Analysis': 'You are a financial analyst. Provide data-driven insights and identify trends.',
      'Business Documents': 'You are a business consultant. Give strategic recommendations and actionable insights.',
      'Scientific Papers': 'You are a research scientist. Explain findings, methodology, and implications.',
      'Legal Documents': 'You are a legal expert. Explain terms clearly while maintaining accuracy.',
    };

    const systemPrompt = categoryPrompts[ragData.category] || 
      'You are an intelligent document assistant. Answer based on the provided context.';

    const prompt = `${systemPrompt}

Context from documents:
${ragData.context}

Question: ${question}

Answer the question based ONLY on the context provided above. If the context doesn't contain the answer, say so clearly. Include specific references to the source documents when possible.`;

    // Step 3: Call LLM with context
    const llmResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,  // Lower temperature for factual answers
        top_p: 0.9,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error('LLM API error:', llmResponse.status, errorText);
      throw new Error(`LLM API error: ${llmResponse.status} - ${errorText}`);
    }

    const llmData = await llmResponse.json();
    const answer = llmData.choices?.[0]?.message?.content || 'No response generated.';

    return NextResponse.json({
      success: true,
      answer,
      sources: ragData.sources,
      category: ragData.category,
      question
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: 'Failed to answer question' },
      { status: 500 }
    );
  }
}
