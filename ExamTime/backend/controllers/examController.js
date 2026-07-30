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
        const cleanCode = String(code).trim();

        let exam = await Exam.findOne({ code: { $regex: new RegExp(`^${cleanCode}$`, 'i') } })
            .populate('listeningSet')
            .populate('readingSet')
            .populate('writingSet')
            .populate('speakingSet');

        if (!exam) {
            const formattedCode = cleanCode.replace(/([a-zA-Z]+)(\d+)/g, '$1-$2');
            exam = await Exam.findOne({ code: { $regex: new RegExp(`^${formattedCode}$`, 'i') } })
                .populate('listeningSet')
                .populate('readingSet')
                .populate('writingSet')
                .populate('speakingSet');
        }

        if (!exam || !exam.isPublished) {
            return res.status(404).json({ message: 'cannot find exams with this code' });
        }

        return res.json(exam);
    } catch (error) {
        console.error('[getExamByCode] error:', error.message);
        return res.status(500).json({ message: 'cannot get exams' });
    }
}