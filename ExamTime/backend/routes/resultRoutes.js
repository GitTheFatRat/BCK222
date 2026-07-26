import { Router } from 'express';
import multer from 'multer';

import { submitResult, getMyResults } from '../controllers/resultController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

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

export default router;