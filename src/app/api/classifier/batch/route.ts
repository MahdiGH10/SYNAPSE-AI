import { NextRequest, NextResponse } from 'next/server';

const CLASSIFIER_SERVICE_URL = process.env.CLASSIFIER_SERVICE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents, return_probabilities = true } = body;

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { success: false, error: 'Documents array is required' },
        { status: 400 }
      );
    }

    // Call Python classifier service
    const response = await fetch(`${CLASSIFIER_SERVICE_URL}/batch-classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documents,
        return_probabilities,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Batch classification failed');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Batch classifier API error:', error);
    
    if (error.message?.includes('fetch')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document classifier service is unavailable',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Batch classification failed' },
      { status: 500 }
    );
  }
}
