import mongoose from 'mongoose';

const learningSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    confidence: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    targetDate: { type: String, default: '' },
    lastUpdated: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Learning', learningSchema);
