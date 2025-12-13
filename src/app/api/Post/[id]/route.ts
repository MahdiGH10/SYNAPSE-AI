import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post";

// GET /api/Post/:id  -> count posts for userID = :id
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const { id } = await context.params; // id == userID
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const count = await Post.countDocuments({ userID: id });

    return NextResponse.json(
      {
        success: true,
        message: "Post count fetched successfully",
        userID: id,
        count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Post count fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post count", error: (error as Error).message },
      { status: 500 }
    );
  }
}