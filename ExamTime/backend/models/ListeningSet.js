import mongoose from 'mongoose';

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

const sectionSchema = new mongoose.Schema(
    {
        sectionNumber: { type: Number, required: true },
        audioUrl: { type: String, required: true },
        questions: [questionSchema]
    },
    { _id: false }
)

const listeningSetSchema = new mongoose.Schema(
    {
        sections: [sectionSchema],
    },
    { timestamps: true }
)

export default mongoose.model('ListeningSet', listeningSetSchema);