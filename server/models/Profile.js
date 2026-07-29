import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    college: { type: String, default: '' },
    cgpa: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Profile', profileSchema);
