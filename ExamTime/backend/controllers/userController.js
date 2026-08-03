import User from '../models/User.js';
import ExamResult from '../models/ExamResult.js';

export async function getPublicProfile(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('username avatar banner role description createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get recent activities and stats
        const results = await ExamResult.find({ user: id })
            .populate('exam', 'title code')
            .sort('-createdAt');

        const uniqueExams = new Set();
        let totalListening = 0, listeningCount = 0;
        let totalReading = 0, readingCount = 0;
        let totalWriting = 0, writingCount = 0;
        let totalSpeaking = 0, speakingCount = 0;
        let totalOverall = 0, overallCount = 0;

        const recentActivities = [];

        for (const r of results) {
            if (r.exam) uniqueExams.add(r.exam._id.toString());
            
            // Build recent activities (limit to 5)
            if (recentActivities.length < 5) {
                // Avoid pushing same session multiple times, just group by sessionId
                const existing = recentActivities.find(act => act.sessionId === r.sessionId);
                if (!existing) {
                    recentActivities.push({
                        sessionId: r.sessionId,
                        examTitle: r.exam?.title,
                        skill: r.skill,
                        createdAt: r.createdAt,
                    });
                }
            }

            // Calculate averages
            if (r.scores) {
                if (r.scores.listeningBand) {
                    totalListening += r.scores.listeningBand;
                    listeningCount++;
                }
                if (r.scores.readingBand) {
                    totalReading += r.scores.readingBand;
                    readingCount++;
                }
                if (r.scores.writingBand) {
                    totalWriting += r.scores.writingBand;
                    writingCount++;
                }
                if (r.scores.speakingBand) {
                    totalSpeaking += r.scores.speakingBand;
                    speakingCount++;
                }
                if (r.scores.overallBand) {
                    totalOverall += r.scores.overallBand;
                    overallCount++;
                }
            }
        }

        const stats = {
            examsTaken: uniqueExams.size,
            avgListening: listeningCount > 0 ? (totalListening / listeningCount).toFixed(1) : null,
            avgReading: readingCount > 0 ? (totalReading / readingCount).toFixed(1) : null,
            avgWriting: writingCount > 0 ? (totalWriting / writingCount).toFixed(1) : null,
            avgSpeaking: speakingCount > 0 ? (totalSpeaking / speakingCount).toFixed(1) : null,
            avgOverall: overallCount > 0 ? (totalOverall / overallCount).toFixed(1) : null,
        };

        return res.json({
            user,
            stats,
            recentActivities
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
