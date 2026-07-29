import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Research Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Category
    category: {
      type: String,
      required: true,
      enum: [
        'Tech News',
        'Emerging Technology',
        'Company Challenge',
        'Research Paper',
        'Artificial Intelligence',
        'Cloud Computing',
        'Cybersecurity',
        'DevOps',
        'System Design',
        'Database',
        'Networking',
        'Blockchain',
        'IoT',
        'Programming',
      ],
    },

    // Optional company
    company: {
      type: String,
      default: '',
      trim: true,
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },

    // Short summary
    summary: {
      type: String,
      default: '',
      trim: true,
    },

    // Detailed content
    content: {
      type: String,
      required: true,
    },

    // Source URL
    source: {
      type: String,
      default: '',
      trim: true,
    },

    // Bookmark
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Research', researchSchema);