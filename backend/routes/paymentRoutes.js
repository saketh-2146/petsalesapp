import express from 'express';
import { getTransactions, processPayment, addMoneyToWallet, getWalletBalance } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/transactions', getTransactions);
router.post('/process', processPayment);
router.post('/wallet/add', addMoneyToWallet);
router.get('/wallet', getWalletBalance);

export default router;
