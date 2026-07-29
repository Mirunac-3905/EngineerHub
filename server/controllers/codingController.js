import Coding from '../models/Coding.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const items = await Coding.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

export const create = asyncHandler(async (req, res) => {
  const existing = await Coding.findOne({
    userId: req.user._id,
    platform: req.body.platform,
  });
  if (existing) {
    return res.status(409).json({ message: 'This platform is already connected.' });
  }
  const item = await Coding.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Coding.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Profile not found.' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Coding.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ message: 'Profile not found.' });
  res.json({ message: 'Profile deleted.' });
});
