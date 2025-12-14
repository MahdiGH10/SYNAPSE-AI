import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    await connectDB();
    console.log('DB connected');

    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', !!user, 'Has password:', !!user?.password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user registered with Google OAuth
    if (!user.password && user.googleId) {
      return NextResponse.json(
        {
          success: false,
          message: 'This account uses Google Sign-In. Please sign in with Google.',
        },
        { status: 400 }
      );
    }

    // Check password
    console.log('Comparing password...');
    const isPasswordMatch = await user.comparePassword(password);
    console.log('Password match:', isPasswordMatch);
    
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if email is verified
    console.log('User verified:', user.verified);
    if (!user.verified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        },
        { status: 403 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token with role
    console.log('Generating token for user:', user._id.toString(), 'role:', user.role);
    const token = generateToken(user._id.toString(), user.email, user.name, user.role);
    console.log('Token generated successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
