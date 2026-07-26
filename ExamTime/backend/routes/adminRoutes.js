import { Router } from 'express';

import { ingestExamFolder } from '../controllers/ingestController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/ingest-exam', authMiddleware, roleMiddleware('admin'), ingestExamFolder);

export default router;