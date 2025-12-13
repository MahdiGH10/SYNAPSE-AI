import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import Chat from '@/models/Chat';

// GET /api/chats/[chatId] - Get specific chat with full messages
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    const { chatId } = params;

    // Find chat by chatId and userId (security check)
    const chat = await Chat.findOne({ chatId, userId });

    if (!chat) {
      return NextResponse.json({ 
        error: 'Chat not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        chatId: chat.chatId,
        title: chat.title,
        messages: chat.messages,
        metadata: chat.metadata,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });

  } catch (error: any) {
    console.error('Get chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get chat' 
    }, { status: 500 });
  }
}

// DELETE /api/chats/[chatId] - Delete a chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    const { chatId } = params;

    // Delete chat (ensure user owns it)
    const result = await Chat.deleteOne({ chatId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: 'Chat not found or already deleted' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Chat deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete chat' 
    }, { status: 500 });
  }
}

// PATCH /api/chats/[chatId] - Update chat title
export async function PATCH(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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
    const { chatId } = params;
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 });
    }

    // Update chat title
    const chat = await Chat.findOneAndUpdate(
      { chatId, userId },
      { title },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ 
        error: 'Chat not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        chatId: chat.chatId,
        title: chat.title,
      },
    });

  } catch (error: any) {
    console.error('Update chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update chat' 
    }, { status: 500 });
  }
}
