import Calendar from '../models/Calendar.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const items = await Calendar.find({ userId: req.user._id }).sort({ date: 1 });
  res.json(items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Calendar.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ message: 'Event not found.' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await Calendar.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Calendar.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Event not found.' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Calendar.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ message: 'Event not found.' });
  res.json({ message: 'Event deleted.' });
});
