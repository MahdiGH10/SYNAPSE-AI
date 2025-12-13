import mongoose, { Document, Model } from "mongoose";

// Définir l'interface pour les Likes (et Dislikes)
export interface Ifavor extends Document {
  userID: mongoose.Schema.Types.ObjectId;
  Exercice: mongoose.Schema.Types.ObjectId;
  type: "like" | "dislike"; 
  updatedAt: Date;
}

// Définir le schéma pour Like/Dislike
const FavorSchema = new mongoose.Schema<Ifavor>(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'utilisateur
      ref: "User",
      required: true,
    },
    Exercice: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'exercice
      ref: "Exercice",
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
export const favor: Model<Ifavor> =
  mongoose.models.Favor || mongoose.model<Ifavor>("Favor", FavorSchema);