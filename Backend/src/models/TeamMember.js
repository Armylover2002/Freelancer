import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    photo: {
      url: String,
      publicId: String,
    },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    experienceText: { type: String, default: '', maxlength: 120 },
    specialty: { type: String, default: '', maxlength: 150 },
    technologies: [{ type: String, trim: true, maxlength: 60 }],
    bio: { type: String, default: '', maxlength: 2000 },
    projectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    socials: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ active: 1, order: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
