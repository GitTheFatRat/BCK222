import { readFile } from 'fs/promises';
import mongoose from 'mongoose';

import ExamResult from '../models/ExamResult.js';
import Exam from '../models/Exam.js';
import ListeningSet from '../models/ListeningSet.js';
import ReadingSet from '../models/ReadingSet.js';

let bandScale = null;
async function loadBandScale() {
    if (!bandScale) {
        const raw = await readFile(new URL('../config/bandScale.json', import.meta.url), 'utf-8');
        bandScale = JSON.parse(raw);
    }
    return bandScale;
}

function countCorrectAnswers(userAnswers, questions) {
    let correctCount = 0;
    for (const question of questions) {
        if (!question || !question.qId) continue;
        const userAnswer = userAnswers[question.qId];
        if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
            correctCount += 1;
        }
    }
    return correctCount;
}

function lookupBand(scaleList, correctCount) {
    if (!Array.isArray(scaleList)) return null;
    const match = scaleList.find(
        (row) => correctCount >= row.minCorrect && correctCount <= row.maxCorrect
    );
    return match ? match.band : null;
}

function calculateOverallBand(scores) {
    const values = [scores.listeningBand, scores.readingBand, scores.writingBand, scores.speakingBand].filter(
        (v) => typeof v === 'number'
    );
    if (values.length === 0) return null;

    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(average * 2) / 2;
}

export async function submitResult(req, res) {
    try {
        const { examId, writingTask1Text, writingTask2Text } = req.body;
        let skill = req.body.skill;

        if (skill && skill.startsWith('writing')) {
            skill = 'writing';
        }

        let answers = {};
        if (req.body.answers) {
            answers = typeof req.body.answers === 'string' ? JSON.parse(req.body.answers) : req.body.answers;
        }

        let cheatingLog = [];
        if (req.body.cheatingLog) {
            cheatingLog = typeof req.body.cheatingLog === 'string' ? JSON.parse(req.body.cheatingLog) : req.body.cheatingLog;
        }

        if (!examId) {
            return res.status(400).json({ message: 'Thieu examId.' });
        }

        const ALLOWED_SKILLS = ['listening', 'reading', 'writing', 'speaking', 'full'];
        if (!skill || !ALLOWED_SKILLS.includes(skill)) {
            return res.status(400).json({ message: 'Skill khong hop le hoac bi thieu.' });
        }

        let exam = null;
        if (mongoose.Types.ObjectId.isValid(examId)) {
            exam = await Exam.findById(examId);
        }
        if (!exam) {
            const cleanCode = String(examId).trim();
            exam = await Exam.findOne({ code: { $regex: new RegExp(`^${cleanCode}$`, 'i') } });
            if (!exam) {
                const formattedCode = cleanCode.replace(/([a-zA-Z]+)(\d+)/g, '$1-$2');
                exam = await Exam.findOne({ code: { $regex: new RegExp(`^${formattedCode}$`, 'i') } });
            }
        }

        if (!exam) {
            return res.status(404).json({ message: 'Khong tim thay de thi.' });
        }

        const scale = await loadBandScale();
        const scores = {
            listeningBand: null,
            readingBand: null,
            writingBand: null,
            speakingBand: null,
            overallBand: null,
        };

        if ((skill === 'listening' || skill === 'full') && exam.listeningSet) {
            const listeningSet = await ListeningSet.findById(exam.listeningSet);
            if (listeningSet) {
                const allListeningQuestions = (listeningSet.sections || []).flatMap((s) => s.questions || []);
                const correctCount = countCorrectAnswers(answers, allListeningQuestions);
                scores.listeningBand = lookupBand(scale.listening, correctCount);
            }
        }

        if ((skill === 'reading' || skill === 'full') && exam.readingSet) {
            const readingSet = await ReadingSet.findById(exam.readingSet);
            if (readingSet) {
                const allReadingQuestions = (readingSet.passages || []).flatMap((p) => p.questions || []);
                const correctCount = countCorrectAnswers(answers, allReadingQuestions);
                scores.readingBand = lookupBand(scale.reading, correctCount);
            }
        }

        scores.overallBand = calculateOverallBand(scores);

        const result = await ExamResult.create({
            user: req.user.id,
            exam: exam._id,
            skill,
            answers,
            cheatingLog,
            writingTask1Text: writingTask1Text || '',
            writingTask2Text: writingTask2Text || '',
            speakingRecordingUrl: req.file ? `/uploads/speaking/${req.file.filename}` : null,
            scores,
            status: writingTask1Text || writingTask2Text || req.file ? 'GRADING' : 'GRADED',
        });

        return res.status(201).json(result);
    } catch (err) {
        console.error('[submitResult] Loi:', err);
        return res.status(500).json({ message: 'Nop bai that bai. Vui long thu lai.' });
    }
}

export async function getMyResults(req, res) {
    try {
        const results = await ExamResult.find({ user: req.user.id })
            .populate('exam', 'title code')
            .sort('-createdAt');

        const formatted = results.map((r) => ({
            _id: r._id,
            examTitle: r.exam?.title || 'Khong xac dinh',
            createdAt: r.createdAt,
            scores: r.scores,
            status: r.status,
        }));

        return res.json(formatted);
    } catch (err) {
        console.error('[getMyResults] Loi:', err.message);
        return res.status(500).json({ message: 'Khong the tai lich su ket qua.' });
    }
}