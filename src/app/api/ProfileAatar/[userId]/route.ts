// SYNAPSE-AI/src/app/api/ProfileAatar/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import { Avatar } from '@/models/Avatar';



export async function GET(req: Request, context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await context.params;
    if (!userId) {
        return NextResponse.json(
            { success: false, message: 'User ID is required' },
            { status: 400 }
        );
    }
    const avatar = await Avatar.findOne({ userId: userId });
    if (!avatar) {
        return NextResponse.json(
            { success: false, message: 'Avatar not found' },
            { status: 404 }
        );
    }
    return NextResponse.json(
      {
        success: true,
        message: 'Avatar fetched successfully',
        data: avatar,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Avatar fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch avatar' },
      { status: 500 }
    );
  }
}