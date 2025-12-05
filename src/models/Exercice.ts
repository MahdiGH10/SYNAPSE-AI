import mongoose, { Document, Model } from 'mongoose';


export interface Iexercice extends Document {
    userID : mongoose.Schema.Types.ObjectId;
    title: string;
    type: 'qcm' | 'problemes' | 'etudes_de_cas';
    questions: String[];
    correctAnswers: String[];
    createdAt: Date;
    updatedAt: Date;
}

const ExerciceSchema = new mongoose.Schema<Iexercice>(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['qcm', 'problemes', 'etudes_de_cas'],
            required: true,
        },
        questions: {
            type:[],
            required: true,
        },
        correctAnswers: {
            type:[],
            required: true,
        },
    },
    { timestamps: true }
);

export const Exercice: Model<Iexercice> = mongoose.models.Exercice || mongoose.model<Iexercice>('Exercice', ExerciceSchema);