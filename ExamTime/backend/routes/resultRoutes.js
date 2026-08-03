import { Router } from 'express';
import multer from 'multer';

import { submitResult, getMyResults, getPendingGradingTasks, gradeResult, getCheatingLogs, getLeaderboard } from '../controllers/resultController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/speaking/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, `${req.user.id}-${uniqueSuffix}.webm`);
    },
});

const upload = multer({ storage });

router.post('/submit', authMiddleware, upload.single('speakingRecording'), submitResult);
router.get('/me', authMiddleware, getMyResults);
router.get('/leaderboard', authMiddleware, getLeaderboard);

router.get('/admin/pending', authMiddleware, roleMiddleware('admin', 'teacher'), getPendingGradingTasks);
router.put('/admin/:id/grade', authMiddleware, roleMiddleware('admin', 'teacher'), gradeResult);
router.get('/admin/cheating-logs', authMiddleware, roleMiddleware('admin', 'teacher'), getCheatingLogs);

export default router;