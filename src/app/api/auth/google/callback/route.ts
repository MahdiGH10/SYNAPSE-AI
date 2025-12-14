import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('Google callback - Email:', email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find or create the user by email
    let user = await User.findOne({ email });

    if (!user) {
      console.log('User not found, creating new user for:', email);
      // Create new user from Google data
      user = await User.create({
        email,
        name: email.split('@')[0], // Use email prefix as default name
        provider: 'google',
        isVerified: true, // Google accounts are pre-verified
        lastLogin: new Date(),
      });
      console.log('New user created:', user.email);
    } else {
      console.log('User found:', user.email);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token for our app with role
    const token = generateToken(user.id.toString(), user.email, user.name, user.role);

    return NextResponse.json({ 
      success: true,
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { error: "Callback failed" },
      { status: 500 }
    );
  }
}
