import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        listeningSet: { type: mongoose.Schema.Types.ObjectId, ref: 'ListeningSet', required: true },
        readingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingSet', required: true },
        writingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'WritingSet', required: true },
        speakingSet: { type: mongoose.Schema.Types.ObjectId, ref: 'SpeakingSet', required: true },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Exam', examSchema);