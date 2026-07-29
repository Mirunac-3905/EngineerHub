import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Study Session', 'Revision', 'Interview', 'Coding Contest'],
      default: 'Study Session',
    },
    date: { type: String, required: true },
    time: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model('Calendar', calendarSchema);
