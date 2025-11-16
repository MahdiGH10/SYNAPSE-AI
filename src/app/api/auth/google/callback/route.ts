import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token for our app
    const token = generateToken(user._id.toString(), user.email);

    return NextResponse.json({ 
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
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
