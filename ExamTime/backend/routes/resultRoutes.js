import { Router } from 'express';
import multer from 'multer';

import { submitResult, getMyResults, getPendingGradingTasks, gradeResult } from '../controllers/resultController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

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

router.get('/admin/pending', authMiddleware, adminMiddleware, getPendingGradingTasks);
router.put('/admin/:id/grade', authMiddleware, adminMiddleware, gradeResult);

export default router;