import mongoose, { Document, Model } from 'mongoose';

export interface IPost extends Document {
    userID : mongoose.Schema.Types.ObjectId;
    content: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);
export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);