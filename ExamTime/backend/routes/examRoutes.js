import { Router } from 'express';

import { getAllExams, getExamByCode } from '../controllers/examController.js';
import { filterExamMiddleware } from '../middlewares/filterExamMiddleware.js';

const router = Router();

router.get('/', getAllExams);
router.get('/:code', filterExamMiddleware, getExamByCode);

export default router;