import express from 'express';
import { getAdoptionRequests, submitAdoptionRequest, updateAdoptionRequest } from '../controllers/adoptionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAdoptionRequests);
router.post('/', submitAdoptionRequest);
router.put('/:id', updateAdoptionRequest);

export default router;
