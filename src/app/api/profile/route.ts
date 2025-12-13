import { Iprofile,Profile } from "@/models/Profile";
import User from "@/models/User";
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
        
        // Also update the User model with the avatar/profile picture
        if (avatar) {
            await User.findByIdAndUpdate(userId, { 
                image: avatar,
                profilePicture: avatar  // Add this field too for compatibility
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

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }
        
        // Fetch user data
        const user = await User.findById(userId).select('name email profilePicture image');
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        
        // Fetch profile data
        const profile = await Profile.findOne({ userId });
        
        return NextResponse.json(
            {
                success: true,
                data: {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture || user.image,
                    bio: profile?.bio || '',
                    location: profile?.location || '',
                    website: profile?.website || '',
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}