import express from 'express';
import { getReviews, submitReview, getAverageRating } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: view reviews and average ratings
router.get('/', getReviews);
router.get('/average', getAverageRating);

// Protected: submit reviews
router.post('/', requireAuth, submitReview);

export default router;
