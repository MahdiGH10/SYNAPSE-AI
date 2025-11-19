import mongoose, { Document, Model } from 'mongoose';

export interface Iprofile extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    bio?: string;
    location?: string;
    avatar?: string;
    website?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema = new mongoose.Schema<Iprofile>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [160, 'Bio cannot exceed 160 characters'],
            default: '',
        },
        location: {
            type: String,
            maxlength: [100, 'Location cannot exceed 100 characters'],
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        website: {
            type: String,
            maxlength: [100, 'Website cannot exceed 100 characters'],
            default: '',
        },
    },
    { timestamps: true }
);

export const Profile: Model<Iprofile> = mongoose.models.Profile || mongoose.model<Iprofile>('Profile', ProfileSchema);