import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import UserPreferences from '@/models/UserPreferences';

// GET /api/preferences - Get user preferences
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;

    // Get or create preferences
    const preferences = await (UserPreferences as any).getOrCreate(userId);

    return NextResponse.json({
      success: true,
      data: {
        learningStyle: preferences.learningStyle,
        favoriteSubjects: preferences.favoriteSubjects,
        difficultyLevel: preferences.difficultyLevel,
        chatSettings: preferences.chatSettings,
        conversationHistory: preferences.conversationHistory,
        learningPatterns: {
          questionTypes: Object.fromEntries(preferences.learningPatterns.questionTypes),
          subjectFrequency: Object.fromEntries(preferences.learningPatterns.subjectFrequency),
          responseQuality: preferences.learningPatterns.responseQuality,
          comprehensionLevel: preferences.learningPatterns.comprehensionLevel,
        },
        personalizedPrompt: preferences.getPersonalizedPrompt(),
      },
    });

  } catch (error: any) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get preferences' 
    }, { status: 500 });
  }
}

// PATCH /api/preferences - Update user preferences
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;
    const body = await request.json();

    // Get existing preferences
    const preferences = await (UserPreferences as any).getOrCreate(userId);

    // Update allowed fields
    if (body.learningStyle) preferences.learningStyle = body.learningStyle;
    if (body.favoriteSubjects) preferences.favoriteSubjects = body.favoriteSubjects;
    if (body.difficultyLevel) preferences.difficultyLevel = body.difficultyLevel;
    if (body.chatSettings) {
      preferences.chatSettings = { ...preferences.chatSettings, ...body.chatSettings };
    }

    await preferences.save();

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        learningStyle: preferences.learningStyle,
        favoriteSubjects: preferences.favoriteSubjects,
        difficultyLevel: preferences.difficultyLevel,
        chatSettings: preferences.chatSettings,
      },
    });

  } catch (error: any) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update preferences' 
    }, { status: 500 });
  }
}
