import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const items = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ message: 'Project not found.' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const item = await Project.create({ ...req.body, userId: req.user._id });
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!item) return res.status(404).json({ message: 'Project not found.' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!item) return res.status(404).json({ message: 'Project not found.' });
  res.json({ message: 'Project deleted.' });
});
