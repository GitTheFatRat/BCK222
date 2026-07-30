import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
        },
        skill: {
            type: String,
            enum: ['listening', 'reading', 'writing-task1', 'writing-task2', 'speaking', 'full'],
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        answers: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        writingTask1Text: {
            type: String,
            default: '',
        },
        writingTask2Text: {
            type: String,
            default: '',
        },
        speakingRecordingUrl: {
            type: String,
            default: null,
        },
        scores: {
            listeningBand: { type: Number, default: null },
            readingBand: { type: Number, default: null },
            writingBand: { type: Number, default: null }, //note: need operator
            speakingBand: { type: Number, default: null },
            overallBand: { type: Number, default: null },
        },
        cheatingLog: [
            {
                timestamp: { type: Date, required: true },
                type: { type: String, required: true },
                _id: false,
            },
        ],
        status: {
            type: String,
            enum: ['SUBMITTED', 'GRADING', 'GRADED'],
            default: 'SUBMITTED',
        },
    },
    { timestamps: true }
);

export default mongoose.model('ExamResult', examResultSchema);