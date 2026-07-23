import express from 'express';
import { getNotifications, createNotification, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.post('/', createNotification);

// IMPORTANT: /read-all must be before /:id/read to prevent route conflict
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
