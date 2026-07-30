import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Settings from '../models/Settings.js';
import { generateToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = await User.create({ name, email, password });

  // Seed a default profile + settings for the new user
  await Profile.create({ userId: user._id, name, email });
  await Settings.create({ userId: user._id });

  res.status(201).json({
    message: 'Registration successful. Please log in to continue.',
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user._id);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — client simply discards the token.
  res.json({ message: 'Logged out successfully.' });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = await User.findOne({ email });
  // Always respond positively to avoid leaking which emails exist.
  res.json({
    message: user
      ? 'Reset link sent to your email.'
      : 'If an account exists, a reset link has been sent.',
  });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  // In a real app, verify the reset token here. For this demo, accept any
  // non-empty token and require an email to identify the user.
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required to reset password.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.password = password;
  await user.save();
  res.json({ message: 'Password reset successful. You can now log in.' });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ _id: user._id, name: user.name, email: user.email });
});
