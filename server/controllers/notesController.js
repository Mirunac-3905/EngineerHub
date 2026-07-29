import Note from '../models/Note.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const items = await Note.find({ userId: req.user._id }).sort({ pinned: -1, createdAt: -1 });
  res.json(items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Note.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ message: 'Note not found.' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Note not found.' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ message: 'Note not found.' });
  res.json({ message: 'Note deleted.' });
});
