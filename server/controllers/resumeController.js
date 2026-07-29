import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  },
});

export const uploadMiddleware = upload.single('resume');

// GET /api/resume
export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  res.json(resume || null);
});

// POST /api/resume
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  // Delete previous file + record
  const existing = await Resume.findOne({ userId: req.user._id });
  if (existing) {
    const oldPath = path.join(uploadDir, path.basename(existing.fileUrl));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    await Resume.deleteOne({ _id: existing._id });
  }

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    fileSize: req.file.size,
  });

  res.status(201).json(resume);
});

// PUT /api/resume (replace)
export const replaceResume = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const existing = await Resume.findOne({ userId: req.user._id });
  if (existing) {
    const oldPath = path.join(uploadDir, path.basename(existing.fileUrl));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const resume = await Resume.findOneAndUpdate(
    { userId: req.user._id },
    {
      $set: {
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
      },
    },
    { new: true, upsert: true },
  );

  res.json(resume);
});

// DELETE /api/resume
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  if (!resume) return res.status(404).json({ message: 'No resume found.' });

  const filePath = path.join(uploadDir, path.basename(resume.fileUrl));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await Resume.deleteOne({ _id: resume._id });
  res.json({ message: 'Resume deleted.' });
});
