import { Comment, Icomment } from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { post, userID, content, timestamp } = await request.json();

    // create comment document
    const newComment = await Comment.create({
      post,
      userID,
      content,
      timestamp,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Comment created successfully",
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create comment", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Read post id from query string: /api/commant?post=<postId>
    const url = new URL(request.url);
    const post = url.searchParams.get("post");

    if (!post) {
      return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
    }

    const comments = await Comment.find({ post }).sort({ timestamp: -1 });
    return NextResponse.json(
      {
        success: true,
        message: "Comments fetched successfully",
        data: comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch comments" }, { status: 500 });
  }
}