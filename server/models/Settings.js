import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  },
  { timestamps: true },
);

export default mongoose.model('Settings', settingsSchema);
