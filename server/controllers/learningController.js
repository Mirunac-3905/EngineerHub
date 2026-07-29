import Learning from '../models/Learning.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/learning
export const getAll = asyncHandler(async (req, res) => {
  const items = await Learning.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/learning/:id
export const getById = asyncHandler(async (req, res) => {
  const item = await Learning.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ message: 'Topic not found.' });
  res.json(item);
});

// POST /api/learning
export const create = asyncHandler(async (req, res) => {
  const item = await Learning.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
});

// PUT /api/learning/:id
export const update = asyncHandler(async (req, res) => {
  const item = await Learning.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: { ...req.body, lastUpdated: new Date().toISOString() } },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Topic not found.' });
  res.json(item);
});

// DELETE /api/learning/:id
export const remove = asyncHandler(async (req, res) => {
  const item = await Learning.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ message: 'Topic not found.' });
  res.json({ message: 'Topic deleted.' });
});
