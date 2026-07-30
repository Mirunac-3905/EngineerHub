import mongoose from 'mongoose';

const structuredResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: [
      {
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        field: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        gpa: { type: String, default: '' },
      },
    ],
    skills: [
      {
        category: { type: String, default: '' },
        skills: [{ type: String }],
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        techStack: [{ type: String }],
        link: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' },
        credentialId: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('StructuredResume', structuredResumeSchema);
