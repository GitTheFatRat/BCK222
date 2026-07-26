import mongoose from 'mongoose';

const writingSetSchema = new mongoose.Schema(
    {
        task1: {
            prompt: { type: String, required: true },
            imageUrl: String,
            minWords: { type: Number, default: 150 },
        },
        task2: {
            prompt: { type: String, required: true },
            imageUrl: String,
            minWords: { type: Number, default: 250 },
        }
    },
    { timestamps: true }
)

export default mongoose.model('WritingSet', writingSetSchema);