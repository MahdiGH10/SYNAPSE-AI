import mongoose, { Document, Model } from 'mongoose';


export interface IAvatar extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
const AvatarSchema = new mongoose.Schema<IAvatar>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
export const Avatar: Model<IAvatar> = mongoose.models.Avatar || mongoose.model<IAvatar>('Avatar', AvatarSchema);