import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import Chat from '@/models/Chat';
import UserPreferences from '@/models/UserPreferences';

// POST /api/chats/save - Save or update a chat
export async function POST(request: NextRequest) {
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

    const userId = decoded.userId;
    const body = await request.json();
    const { chatId, title, messages, metadata } = body;

    if (!chatId || !messages) {
      return NextResponse.json({ 
        error: 'Missing required fields: chatId, messages' 
      }, { status: 400 });
    }

    // Find existing chat or create new one
    let chat = await Chat.findOne({ chatId, userId });

    if (chat) {
      // Update existing chat
      chat.title = title || chat.title;
      chat.messages = messages;
      if (metadata) {
        chat.metadata = { ...chat.metadata, ...metadata };
      }
      // Extract topics from messages
      const topics = (Chat as any).extractTopics(messages);
      chat.metadata.topics = topics;
    } else {
      // Create new chat
      const topics = (Chat as any).extractTopics(messages);
      chat = new Chat({
        userId,
        chatId,
        title: title || 'New chat',
        messages,
        metadata: {
          totalMessages: messages.length,
          topics,
          documentIds: metadata?.documentIds || [],
          lastMessageAt: new Date(),
        },
      });
    }

    await chat.save();

    // Update user preferences with learning patterns
    const userPrefs = await (UserPreferences as any).getOrCreate(userId);
    
    // Update from the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    if (lastUserMessage) {
      userPrefs.updateFromMessage(lastUserMessage.content, true);
      await userPrefs.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        chatId: chat.chatId,
        title: chat.title,
        messageCount: chat.messages.length,
        topics: chat.metadata.topics,
        updatedAt: chat.updatedAt,
      },
    });

  } catch (error: any) {
    console.error('Save chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save chat' 
    }, { status: 500 });
  }
}

// GET /api/chats/save - List user's chats
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

    const userId = decoded.userId;

    // Get user's chats (without full message content for performance)
    const chats = await (Chat as any).findByUserId(userId);

    return NextResponse.json({
      success: true,
      data: chats.map((chat: any) => ({
        chatId: chat.chatId,
        title: chat.title,
        totalMessages: chat.metadata.totalMessages,
        topics: chat.metadata.topics,
        lastMessageAt: chat.metadata.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      })),
    });

  } catch (error: any) {
    console.error('List chats error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to list chats' 
    }, { status: 500 });
  }
}
