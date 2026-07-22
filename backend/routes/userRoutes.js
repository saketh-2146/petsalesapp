import express from 'express';
import { getMe, getUserById, updateUser, getAllUsers } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/', getAllUsers);
router.get('/me', getMe);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
