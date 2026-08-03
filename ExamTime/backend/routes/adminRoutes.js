import { Router } from 'express';

import { ingestExamFolder } from '../controllers/ingestController.js';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/adminUserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/ingest-exam', authMiddleware, roleMiddleware('admin'), ingestExamFolder);

// User Management Routes
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.post('/users', authMiddleware, roleMiddleware('admin'), createUser);
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

export default router;