import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, category } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Search in RAG service
    const response = await fetch(`${RAG_SERVICE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, category, top_k: 5 }),
    });

    if (!response.ok) {
      throw new Error('RAG service search error');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
