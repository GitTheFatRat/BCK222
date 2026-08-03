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
    if (correctCount === 0) return 1.0;
    if (!Array.isArray(scaleList)) return null;
    const match = scaleList.find(
        (row) => correctCount >= row.minCorrect && correctCount <= row.maxCorrect
    );
    return match ? match.band : 1.0;
}

function calculateOverallBand(scores) {
    const values = [scores.listeningBand, scores.readingBand, scores.writingBand, scores.speakingBand].filter(
        (v) => typeof v === 'number'
    );
    if (values.length === 0) return null;

    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(average * 2) / 2;
}

function calculateSessionOverallBand(skills) {
    const bands = [];

    const listeningBand = skills.listening?.scores?.listeningBand;
    if (typeof listeningBand === 'number') bands.push(listeningBand);

    const readingBand = skills.reading?.scores?.readingBand;
    if (typeof readingBand === 'number') bands.push(readingBand);

    const writingTask1Band = skills['writing-task1']?.scores?.writingBand;
    const writingTask2Band = skills['writing-task2']?.scores?.writingBand;

    let writingCombined = null;
    if (typeof writingTask1Band === 'number' && typeof writingTask2Band === 'number') {
        writingCombined = (writingTask1Band * 1 + writingTask2Band * 2) / 3;
        writingCombined = Math.round(writingCombined * 2) / 2;
    } else if (typeof writingTask1Band === 'number') {
        writingCombined = writingTask1Band;
    } else if (typeof writingTask2Band === 'number') {
        writingCombined = writingTask2Band;
    }

    if (typeof writingCombined === 'number') {
        bands.push(writingCombined);
    }

    const speakingBand = skills.speaking?.scores?.speakingBand;
    if (typeof speakingBand === 'number') bands.push(speakingBand);

    if (bands.length === 0) return null;
    const average = bands.reduce((sum, b) => sum + b, 0) / bands.length;
    return Math.round(average * 2) / 2;
}

export async function submitResult(req, res) {
    try {
        const { examId, writingTask1Text, writingTask2Text } = req.body;
        const sessionId = req.body.sessionId;

        if (!sessionId) {
            return res.status(400).json({ message: 'Missing sessionId.' });
        }
        const skill = req.body.skill;

        let answers = {};
        if (req.body.answers) {
            answers = typeof req.body.answers === 'string' ? JSON.parse(req.body.answers) : req.body.answers;
        }

        let cheatingLog = [];
        if (req.body.cheatingLog) {
            cheatingLog = typeof req.body.cheatingLog === 'string' ? JSON.parse(req.body.cheatingLog) : req.body.cheatingLog;
        }

        if (!examId) {
            return res.status(400).json({ message: 'Missing examId.' });
        }

        const ALLOWED_SKILLS = ['listening', 'reading', 'writing-task1', 'writing-task2', 'speaking', 'full'];
        if (!skill || !ALLOWED_SKILLS.includes(skill)) {
            return res.status(400).json({ message: 'Invalid or missing skill.' });
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
            return res.status(404).json({ message: 'Exam not found.' });
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

        let requiresManualGrading = false;

        if (skill === 'writing-task1') {
            const wordCount = (writingTask1Text || '').trim().split(/\s+/).filter(Boolean).length;
            if (wordCount <= 2) {
                scores.writingBand = 1.0;
            } else {
                requiresManualGrading = true;
            }
        } else if (skill === 'writing-task2') {
            const wordCount = (writingTask2Text || '').trim().split(/\s+/).filter(Boolean).length;
            if (wordCount <= 2) {
                scores.writingBand = 1.0;
            } else {
                requiresManualGrading = true;
            }
        } else if (skill === 'speaking') {
            if (!req.file) {
                scores.speakingBand = 1.0;
            } else {
                requiresManualGrading = true;
            }
        }

        scores.overallBand = calculateOverallBand(scores);

        const result = await ExamResult.create({
            user: req.user.id,
            exam: exam._id,
            skill,
            sessionId,
            answers,
            cheatingLog,
            writingTask1Text: writingTask1Text || '',
            writingTask2Text: writingTask2Text || '',
            speakingRecordingUrl: req.file ? `/uploads/speaking/${req.file.filename}` : null,
            scores,
            status: requiresManualGrading ? 'GRADING' : 'GRADED',
        });

        return res.status(201).json(result);
    } catch (err) {
        console.error('[submitResult] Error:', err);
        return res.status(500).json({ message: 'Submission failed. Please try again.' });
    }
}

export async function getMyResults(req, res) {
    try {
        const results = await ExamResult.find({ user: req.user.id })
            .populate('exam', 'title code')
            .sort('-createdAt');

        const sessionMap = new Map();

        for (const r of results) {
            const key = r.sessionId;
            if (!sessionMap.has(key)) {
                sessionMap.set(key, {
                    sessionId: key,
                    examTitle: r.exam?.title || 'Unknown Exam',
                    examCode: r.exam?.code || null,
                    lastUpdatedAt: r.createdAt,
                    skills: {},
                });
            }
            const session = sessionMap.get(key);
            if (!session.skills[r.skill]) {
                session.skills[r.skill] = {
                    resultId: r._id,
                    scores: r.scores,
                    status: r.status,
                    createdAt: r.createdAt,
                    answers: r.answers,
                };
            }
            if (r.createdAt > session.lastUpdatedAt) {
                session.lastUpdatedAt = r.createdAt;
            }
        }

        for (const session of sessionMap.values()) {
            session.overallBand = calculateSessionOverallBand(session.skills);
        }

        const formatted = Array.from(sessionMap.values()).sort(
            (a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)
        );

        return res.json(formatted);
    } catch (err) {
        console.error('[getMyResults] Error:', err.message);
        return res.status(500).json({ message: 'Unable to load result history.' });
    }
}

export async function getPendingGradingTasks(req, res) {
    try {
        const pendingTasks = await ExamResult.find({
            status: { $in: ['GRADING', 'SUBMITTED'] },
            skill: { $in: ['writing-task1', 'writing-task2', 'speaking'] },
        })
            .populate('user', 'username email')
            .populate('exam', 'title code')
            .sort('-createdAt');

        return res.json(pendingTasks);
    } catch (err) {
        console.error('[getPendingGradingTasks] Error:', err.message);
        return res.status(500).json({ message: 'Failed to fetch pending grading tasks.' });
    }
}

export async function gradeResult(req, res) {
    try {
        const { id } = req.params;
        const { score } = req.body;

        if (score === undefined || score === null) {
            return res.status(400).json({ message: 'Score is required.' });
        }

        const result = await ExamResult.findById(id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found.' });
        }

        if (result.skill.startsWith('writing')) {
            result.scores.writingBand = Number(score);
        } else if (result.skill === 'speaking') {
            result.scores.speakingBand = Number(score);
        } else {
            return res.status(400).json({ message: 'Skill does not require manual grading.' });
        }

        result.status = 'GRADED';

        // Recalculate overall band if possible
        result.scores.overallBand = calculateOverallBand(result.scores);

        result.markModified('scores');

        await result.save();

        return res.json({ message: 'Grading submitted successfully', result });
    } catch (err) {
        console.error('[gradeResult] Error:', err.message);
        return res.status(500).json({ message: 'Failed to submit grade.' });
    }
}

export async function getCheatingLogs(req, res) {
    try {
        const results = await ExamResult.find({})
            .populate('user', 'username email')
            .populate('exam', 'title code')
            .sort('-createdAt');

        return res.json(results);
    } catch (err) {
        console.error('[getCheatingLogs] Error:', err.message);
        return res.status(500).json({ message: 'Failed to fetch cheating logs.' });
    }
}

export async function getLeaderboard(req, res) {
    try {
        const leaderboard = await ExamResult.aggregate([
            {
                $group: {
                    _id: '$user',
                    examsTaken: { $addToSet: '$exam' }
                }
            },
            {
                $project: {
                    user: '$_id',
                    examCount: { $size: '$examsTaken' }
                }
            },
            {
                $sort: { examCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$user',
                    username: '$userDetails.username',
                    avatar: '$userDetails.avatar',
                    examCount: 1
                }
            }
        ]);

        return res.json(leaderboard);
    } catch (err) {
        console.error('[getLeaderboard] Error:', err.message);
        return res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
}