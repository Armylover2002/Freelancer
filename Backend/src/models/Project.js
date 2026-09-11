import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    altText: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    businessType: { type: String, trim: true, maxlength: 150 },
    category: { type: String, required: true, trim: true, index: true },
    summary: { type: String, required: true, maxlength: 300 },
    problem: { type: String, default: '', maxlength: 4000 },
    solution: { type: String, default: '', maxlength: 4000 },
    features: [{ type: String, trim: true, maxlength: 200 }],
    techStack: [{ type: String, trim: true, maxlength: 60 }],
    timeline: { type: String, default: '', maxlength: 120 },
    coverImage: imageSchema,
    screenshots: [imageSchema],
    liveUrl: { type: String, default: '', maxlength: 500 },
    results: { type: String, default: '', maxlength: 2000 },
    isFeatured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, maxlength: 70 },
      description: { type: String, maxlength: 160 },
    },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, isFeatured: 1, order: 1 });
projectSchema.index({ title: 'text', summary: 'text', category: 'text' });

export const Project = mongoose.model('Project', projectSchema);
