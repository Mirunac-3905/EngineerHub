import express from 'express';
import {
  getResume,
  uploadResume,
  replaceResume,
  deleteResume,
  uploadMiddleware,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getResume);
router.post('/', protect, uploadMiddleware, uploadResume);
router.put('/', protect, uploadMiddleware, replaceResume);
router.delete('/', protect, deleteResume);

export default router;
