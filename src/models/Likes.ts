import mongoose, { Document, Model } from "mongoose";

// Définir l'interface pour les Likes (et Dislikes)
export interface ILike extends Document {
  userID: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  type: "like" | "dislike"; // Type de réaction (like/dislike)
  createdAt: Date;
  updatedAt: Date;
}

// Définir le schéma pour Like/Dislike
const LikeSchema = new mongoose.Schema<ILike>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'utilisateur
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId, // Référence au post
      ref: "Post",
      required: true,
    },
    type: {
      type: String, // "like" ou "dislike"
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true } // Add timestamps (createdAt, updatedAt)
);

// Exporter le modèle
export const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);