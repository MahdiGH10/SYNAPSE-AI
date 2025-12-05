import {Iexercice,Exercice} from "@/models/Exercice"
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';


export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userID, title, type, questions, correctAnswers } = await request.json();
        const exercice = await Exercice.create({
            userID,
            title,
            type,
            questions,
            correctAnswers,
        });
        return NextResponse.json(
            {
                success: true,
                message: 'Exercice created successfully',
                data: exercice,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Exercice creation error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to create exercice' },
            { status: 500 }
        );
    }
        

}