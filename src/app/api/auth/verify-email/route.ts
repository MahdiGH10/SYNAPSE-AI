import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken, generateToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.verified) {
      // Generate new auth token
      const authToken = generateToken(user._id.toString(), user.email);
      
      return NextResponse.json(
        {
          success: true,
          message: 'Email already verified. You can now log in.',
          data: {
            token: authToken,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              verified: user.verified,
            },
          },
        },
        { status: 200 }
      );
    }

    // Verify email
    user.verified = true;
    await user.save();

    // Generate auth token
    const authToken = generateToken(user._id.toString(), user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! You can now log in.',
        data: {
          token: authToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Email verification failed' },
      { status: 500 }
    );
  }
}
