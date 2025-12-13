import mongoose, { Document, Model } from 'mongoose';

export interface Icomment extends Document {
    userID : mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
const CommentSchema = new mongoose.Schema<Icomment>(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
export const Comment: Model<Icomment> = mongoose.models.Comment || mongoose.model<Icomment>('Comment', CommentSchema);
