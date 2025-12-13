import { favor } from "@/models/favor";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

// POST: upsert (update si existe sinon create)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('Favor POST request body:', body);

    const { Exercice, userID, type } = body;

    if (!Exercice || !userID) {
      console.error('Missing required fields:', { Exercice, userID });
      return NextResponse.json(
        { success: false, message: "Exercice and userID are required." },
        { status: 400 }
      );
    }

    if (!type || !["like", "dislike"].includes(type)) {
      console.error('Invalid type:', type);
      return NextResponse.json(
        { success: false, message: "Invalid type. Must be 'like' or 'dislike'." },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(Exercice)) {
      console.error('Invalid Exercice ObjectId:', Exercice);
      return NextResponse.json(
        { success: false, message: "Invalid Exercice ID format." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      console.error('Invalid userID ObjectId:', userID);
      return NextResponse.json(
        { success: false, message: "Invalid userID format." },
        { status: 400 }
      );
    }

    console.log('Attempting to save favor:', { Exercice, userID, type });

    // Convert to ObjectIds and save
    const reaction = await favor.findOneAndUpdate(
      { 
        Exercice: new mongoose.Types.ObjectId(Exercice), 
        userID: new mongoose.Types.ObjectId(userID) 
      },
      { $set: { type } },
      { new: true, upsert: true }
    );

    console.log('Favor saved successfully:', reaction);

    // Convert ObjectIds to strings
    const reactionData = {
      _id: String(reaction._id),
      userID: String(reaction.userID),
      Exercice: String(reaction.Exercice),
      type: reaction.type,
      createdAt: (reaction as any).createdAt,
      updatedAt: (reaction as any).updatedAt,
    };

    return NextResponse.json(
      { success: true, message: "Reaction saved successfully", data: reactionData },
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(Exercice)) {
      return NextResponse.json(
        { success: false, message: "Invalid Exercice ID format" },
        { status: 400 }
      );
    }

    const filter: any = { Exercice: new mongoose.Types.ObjectId(Exercice) };
    if (type && ["like", "dislike"].includes(type)) {
      filter.type = type;
    }

    const reactions = await favor.find(filter).sort({ createdAt: -1 });

    // Convert ObjectIds to strings for easier comparison on client
    const reactionsWithStringIds = reactions.map(r => ({
      _id: String(r._id),
      userID: String(r.userID),
      Exercice: String(r.Exercice),
      type: r.type,
      createdAt: (r as any).createdAt,
      updatedAt: (r as any).updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        message: `${
          type ? type.charAt(0).toUpperCase() + type.slice(1) + "s" : "Reactions"
        } fetched successfully`,
        data: reactionsWithStringIds,
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