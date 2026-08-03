import { Router } from 'express';
import multer from 'multer';
import { register, login, getMe, updateProfile, uploadAvatar, uploadBanner } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'banner') {
            cb(null, 'uploads/banners/');
        } else {
            cb(null, 'uploads/avatars/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG and WEBP images are allowed'), false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: fileFilter
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.post('/banner', authMiddleware, upload.single('banner'), uploadBanner);

export default router;