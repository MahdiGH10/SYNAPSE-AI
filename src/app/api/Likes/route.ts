import { Like } from "@/models/Likes";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { post, userID, type } = await request.json();

    if (!post || !userID) {
      return NextResponse.json(
        { success: false, message: "post and userID are required." },
        { status: 400 }
      );
    }

    if (!type || !["like", "dislike"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid type. Must be 'like' or 'dislike'." },
        { status: 400 }
      );
    }

    // Upsert: update si existe, sinon create
    const reaction = await Like.findOneAndUpdate(
      { post, userID },           // IMPORTANT: ne pas inclure `type` ici
      { $set: { type } },         // on force le type à la valeur envoyée
      { new: true, upsert: true } // new => retourne le doc après update, upsert => create si absent
    );

    return NextResponse.json(
      {
        success: true,
        message: "Reaction saved successfully",
        data: reaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reaction save error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save reaction", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
    try {
    await connectDB();
    const url = new URL(request.url);
    const post = url.searchParams.get("post"); // <= corriger ici
    const type = url.searchParams.get("type"); // facultatif
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }
    const filter: any = { post };
    if (type && ["like", "dislike"].includes(type)) {
      filter.type = type;
    }
    const reactions = await Like.find(filter);
    return NextResponse.json(
      {
        success: true,
        message: "Reactions fetched successfully",
        data: reactions,
      },
      { status: 200 }
    );
  }
    catch (error) {
    console.error("Reactions fetch error:", error);
    return NextResponse.json(
        { success: false, message: "Failed to fetch reactions" },
        { status: 500 }
        );
    }
}