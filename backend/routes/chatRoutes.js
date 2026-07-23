import express from 'express';
import { getChats, createOrGetChat, getMessages, sendMessage, markChatRead } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getChats);
router.post('/', createOrGetChat);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);
router.put('/:id/read', markChatRead);

export default router;
