import { Iexercice, Exercice } from "@/models/Exercice";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET(req: Request, context: { params: Promise<{ userID: string }> })
{
  try {
    await connectDB();
    const { userID } = await context.params;

    if (!userID) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    const exercices = await Exercice.find({ userID });
    return NextResponse.json(
      {
        success: true,
        message: "Exercices fetched successfully",
        data: exercices,
        },
        { status: 200 }
    );
  }
    catch (error) {
        console.error("Exercice fetch error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch exercices' },
            { status: 500 }
        );
    }
    
}


export async function DELETE(req: Request, context: { params: Promise<{ userID: string }> }) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Exercice ID is required" },
        { status: 400 }
      );
    }
    const deletedExercice = await Exercice.findByIdAndDelete(id);
    if (!deletedExercice) {
      return NextResponse.json(
        { success: false, message: "Exercice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Exercice deleted successfully",
        data: deletedExercice,
      },
      { status: 200 }
    );
  }
  catch (error) {
    console.error("Exercice deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete exercice" },
      { status: 500 }
    );
  }
}