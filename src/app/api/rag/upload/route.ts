import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward to RAG service
    const ragFormData = new FormData();
    ragFormData.append('file', file);

    const response = await fetch(`${RAG_SERVICE_URL}/upload-document`, {
      method: 'POST',
      body: ragFormData,
    });

    if (!response.ok) {
      throw new Error('RAG service error');
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get list of documents
    const response = await fetch(`${RAG_SERVICE_URL}/documents`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
