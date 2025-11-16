import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/route";
import { generateToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login?error=authentication_failed", request.url));
    }

    // Connect to database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=user_not_found", request.url));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token for our app
    const token = generateToken(user._id.toString(), user.email);

    // Redirect to frontend with token
    const redirectUrl = new URL("/chat", request.url);
    redirectUrl.searchParams.set("token", token);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(new URL("/login?error=callback_failed", request.url));
  }
}
