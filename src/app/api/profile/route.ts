import { Iprofile,Profile } from "@/models/Profile";
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';



export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { userId, bio, location, avatar, website } = await request.json();
        // Check if profile exists
        let profile = await Profile.findOne({ userId });
        if (profile) {
            // Update existing profile
            profile.bio = bio || profile.bio;
            profile.location = location || profile.location;
            profile.avatar = avatar || profile.avatar;
            profile.website = website || profile.website;
            await profile.save();
        } else {
            // Create new profile
            profile = await Profile.create({
                userId,
                bio,
                location,
                avatar,
                website,
            });
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Profile saved successfully',
                data: profile,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Profile save error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to save profile' },
            { status: 500 }
        );
    }
}