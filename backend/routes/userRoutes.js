import express from 'express';
import multer from 'multer';
import { getMe, getUserById, updateUser, getAllUsers, uploadAvatar } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// All user routes require authentication
router.use(requireAuth);

// IMPORTANT: /me must be declared BEFORE /:id to prevent route conflict
router.get('/me', getMe);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
