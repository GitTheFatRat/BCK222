import mongoose from 'mongoose';

const speakingSchema = new mongoose.Schema(
    {
        part1: [String],
        part2: {
            cueCard: { type: String, required: true },
            prepSecond: { type: Number, required: true },
            talkSecond: { type: Number, required: true },
        },
        part3: [String],
    },
    { timestamps: true }
);

export default mongoose.model('SpeakingSet', speakingSchema);