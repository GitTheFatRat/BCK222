import Exam from '../models/Exam.js';

export async function getAllExams(req, res) {
    try {
        const exams = await Exam.find({ isPublished: true }).select('title code createdAt');
        return res.json(exams);
    } catch (err) {
        console.error('[getAllExams] err:', err.message);
        return res.status(500).json({ message: 'cannot get exams list' });
    }
}

export async function getExamByCode(req, res) {
    try {
        const { code } = req.params;

        const exam = await Exam.findOne({ code: code.toUpperCase() })
            .populate('listeningSet')
            .populate('readingSet')
            .populate('writingSet')
            .populate('speakingSet');

        if (!exam) {
            return res.status(404).json({ message: 'cannot find exams with this code' });
        }

        if (!exam.isPublished) {
            return res.status(404).json({ message: 'cannot find exams with this code' });
        }

        return res.json(exam);
    } catch (error) {
        console.error('[getExamByCode] error:', error.message);
        return res.status(500).json({ message: 'cannot get exams' });
    }
}