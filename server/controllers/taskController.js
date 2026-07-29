import Task from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({
    userId: req.user._id,
    title,
    completed: false,
  });
  res.status(201).json(task);
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const { title, completed } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: { title, completed } },
    { new: true },
  );
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json({ message: 'Task deleted' });
});
