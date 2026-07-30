import StructuredResume from '../models/StructuredResume.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/structured-resume
export const getStructuredResume = asyncHandler(async (req, res) => {
  const resume = await StructuredResume.findOne({ userId: req.user._id });
  res.json(resume || null);
});

// POST /api/structured-resume
export const createStructuredResume = asyncHandler(async (req, res) => {
  const existing = await StructuredResume.findOne({ userId: req.user._id });
  if (existing) {
    return res.status(400).json({ message: 'Structured resume already exists. Use PUT to update.' });
  }

  const resume = await StructuredResume.create({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json(resume);
});

// PUT /api/structured-resume
export const updateStructuredResume = asyncHandler(async (req, res) => {
  const resume = await StructuredResume.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { new: true, upsert: true },
  );

  res.json(resume);
});

// DELETE /api/structured-resume
export const deleteStructuredResume = asyncHandler(async (req, res) => {
  const resume = await StructuredResume.findOne({ userId: req.user._id });
  if (!resume) return res.status(404).json({ message: 'No structured resume found.' });

  await StructuredResume.deleteOne({ _id: resume._id });
  res.json({ message: 'Structured resume deleted.' });
});
