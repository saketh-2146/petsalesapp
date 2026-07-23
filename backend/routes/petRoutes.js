import express from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPets);
router.get('/:id', getPetById);

// Protected routes (require auth)
router.post('/', requireAuth, createPet);
router.put('/:id', requireAuth, updatePet);
router.delete('/:id', requireAuth, deletePet);

export default router;
