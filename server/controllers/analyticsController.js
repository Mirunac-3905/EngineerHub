import Learning from '../models/Learning.js';
import Note from '../models/Note.js';
import Project from '../models/Project.js';
import Coding from '../models/Coding.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/analytics
export const getSummary = asyncHandler(async (req, res) => {
  const [topicsCompleted, totalNotes, projectsAdded, connectedProfiles] =
    await Promise.all([
      Learning.countDocuments({ userId: req.user._id, progress: 100 }),
      Note.countDocuments({ userId: req.user._id }),
      Project.countDocuments({ userId: req.user._id }),
      Coding.countDocuments({ userId: req.user._id }),
    ]);

  res.json({
    topicsCompleted,
    totalNotes,
    projectsAdded,
    connectedProfiles,
  });
});
