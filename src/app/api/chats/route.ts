import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';

// GET /api/chats - Get all chats for the current user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's chats
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('chatId title metadata createdAt updatedAt');

    return NextResponse.json({
      success: true,
      data: chats,
      count: chats.length,
    });

  } catch (error: any) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get chats' },
      { status: 500 }
    );
  }
}
