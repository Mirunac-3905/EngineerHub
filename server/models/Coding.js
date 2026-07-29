import mongoose from 'mongoose';

const codingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: {
      type: String,
      enum: ['LeetCode', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'CodeChef'],
      required: true,
    },
    username: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  { timestamps: true },
);

// One profile per platform per user
codingSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.model('Coding', codingSchema);
