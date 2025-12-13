import { favor } from "@/models/favor";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

// POST: upsert (update si existe sinon create)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { Exercice, userID, type } = await request.json();

    if (!Exercice || !userID) {
      return NextResponse.json(
        { success: false, message: "Exercice and userID are required." },
        { status: 400 }
      );
    }

    if (!type || !["like", "dislike"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid type. Must be 'like' or 'dislike'." },
        { status: 400 }
      );
    }

    // IMPORTANT: ne pas inclure `type` dans le filtre
    const reaction = await favor.findOneAndUpdate(
      { Exercice, userID },
      { $set: { type } },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { success: true, message: "Reaction saved successfully", data: reaction },
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

// GET: Récupérer les réactions pour un Exercice
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const Exercice = url.searchParams.get("Exercice"); // <= corriger ici
    const type = url.searchParams.get("type"); // facultatif

    if (!Exercice) {
      return NextResponse.json(
        { success: false, message: "Exercice ID is required" },
        { status: 400 }
      );
    }

    const filter: any = { Exercice };
    if (type && ["like", "dislike"].includes(type)) {
      filter.type = type;
    }

    const reactions = await favor.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: `${
          type ? type.charAt(0).toUpperCase() + type.slice(1) + "s" : "Reactions"
        } fetched successfully`,
        data: reactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reaction fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reactions", error: (error as Error).message },
      { status: 500 }
    );
  }
}