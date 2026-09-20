import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    photo: {
      url: String,
      publicId: String,
    },
    role: { type: String, required: true, trim: true, maxlength: 200 },
    experienceText: { type: String, default: '', maxlength: 300 },
    specialty: { type: String, default: '', maxlength: 300 },
    technologies: [{ type: String, trim: true }],
    bio: { type: String, default: '', maxlength: 5000 },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    socials: {
      linkedin: { type: String, maxlength: 500 },
      github: { type: String, maxlength: 500 },
      twitter: { type: String, maxlength: 500 },
      website: { type: String, maxlength: 500 },
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ active: 1, order: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
