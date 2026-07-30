import mongoose from 'mongoose';

const speakingSchema = new mongoose.Schema(
    {
        part1: [String],
        part2: {
            cueCard: { type: String, required: true },
            prepSeconds: { type: Number, default: 60 },
            talkSeconds: { type: Number, default: 120 },
        },
        part3: [String],
    },
    { timestamps: true }
);

export default mongoose.model('SpeakingSet', speakingSchema);