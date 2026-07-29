import express from 'express';
import { getAll, create, update, remove } from '../controllers/codingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAll).post(protect, create);
router.route('/:id').put(protect, update).delete(protect, remove);

export default router;
