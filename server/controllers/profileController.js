import Profile from '../models/Profile.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found.' });
  }
  res.json(profile);
});

// PUT /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    college: req.body.college,
    cgpa: req.body.cgpa,
    skills: req.body.skills,
    github: req.body.github,
    linkedin: req.body.linkedin,
    leetcode: req.body.leetcode,
    codeforces: req.body.codeforces,
    portfolio: req.body.portfolio,
    avatarUrl: req.body.avatarUrl,
  };

  // Remove undefined fields so we don't overwrite with undefined
  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updates },
    { new: true, upsert: true },
  );

  res.json(profile);
});
