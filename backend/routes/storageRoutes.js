import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/storageController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  }
});

// All storage routes require authentication
router.use(requireAuth);

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete', deleteImage);

export default router;
