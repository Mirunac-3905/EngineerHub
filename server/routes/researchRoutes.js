import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../controllers/researchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all research routes
router.use(protect);

// GET all research
// POST new research
router
  .route('/')
  .get(getAll)
  .post(create);

// GET single research
// UPDATE research
// DELETE research
router
  .route('/:id')
  .get(getById)
  .put(update)
  .delete(remove);

export default router;