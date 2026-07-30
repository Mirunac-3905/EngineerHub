import express from 'express';
import {
  getStructuredResume,
  createStructuredResume,
  updateStructuredResume,
  deleteStructuredResume,
} from '../controllers/structuredResumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getStructuredResume).post(createStructuredResume).put(updateStructuredResume);
router.delete('/', deleteStructuredResume);

export default router;
