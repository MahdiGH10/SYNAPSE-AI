import { NextRequest, NextResponse } from 'next/server';

const CLASSIFIER_SERVICE_URL = process.env.CLASSIFIER_SERVICE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, return_probabilities = true } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Call Python classifier service
    const response = await fetch(`${CLASSIFIER_SERVICE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        return_probabilities,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Classification failed');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Classifier API error:', error);
    
    // Check if Python service is unavailable
    if (error.message?.includes('fetch')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document classifier service is unavailable. Please ensure the Python service is running.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Classification failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get model info
    const response = await fetch(`${CLASSIFIER_SERVICE_URL}/model-info`);
    
    if (!response.ok) {
      throw new Error('Failed to get model info');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Model info error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Document classifier service is unavailable',
      },
      { status: 503 }
    );
  }
}
