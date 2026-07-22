import express from 'express';
import { getPets, createPet, updatePet, deletePet } from '../controllers/petController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPets);

// Protected routes (require auth)
router.use(requireAuth);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;
