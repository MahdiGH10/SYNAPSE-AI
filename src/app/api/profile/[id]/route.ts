// app/api/profiles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Profile } from '@/models/Profile';

// GET: /api/profiles/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params is a Promise now
) {
  try {
    await connectDB();

    // Properly await the params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find profile where userId field matches the id from URL
    const profile = await Profile.findOne({ userId: id });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}