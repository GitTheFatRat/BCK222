import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
    {
        qId: { type: String, required: true },
        type: {
            type: String,
            enum: ['gap-fill', 'multiple-choice', 'true-false-notgiven', 'matching'],
            required: true,
        },
        prompt: { type: String, required: true },
        options: [String],
        correctAnswer: mongoose.Schema.Types.Mixed,
        explanation: String,
    },
    { _id: false }
);

const passageSchema = new mongoose.Schema(
    {
        passageNumber: { type: Number, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        questions: [questionSchema],
    },
    { _id: false }
);

const readingSetSchema = new mongoose.Schema(
    {
        passages: [passageSchema],
    },
    { timestamps: true }
);

export default mongoose.model('ReadingSet', readingSetSchema);