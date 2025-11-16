import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken, generateVerificationToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered. Please use a different email or log in.' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verified: false,
    });

    // Generate verification token
    const verificationToken = generateVerificationToken(user._id.toString());

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue registration even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
