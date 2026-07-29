import Settings from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ userId: req.user._id });
  if (!settings) {
    settings = await Settings.create({ userId: req.user._id });
  }
  res.json(settings);
});

// PUT /api/settings
export const updateSettings = asyncHandler(async (req, res) => {
  const updates = {
    theme: req.body.theme,
  };

  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

  const settings = await Settings.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updates },
    { new: true, upsert: true },
  );

  res.json(settings);
});
