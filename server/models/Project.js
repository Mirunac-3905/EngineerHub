import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectName: { type: String, required: true },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    githubLink: { type: String, default: '' },
    liveDemo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
      default: 'Planning',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Project', projectSchema);
