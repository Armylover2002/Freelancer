import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    icon: { type: String, default: '' },
    shortDescription: { type: String, required: true, maxlength: 500 },
    description: { type: String, default: '', maxlength: 8000 },
    features: [{ type: String, trim: true }],
    startingPrice: { type: Number, min: 0 },
    timeline: { type: String, default: '', maxlength: 200 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
    seo: {
      title: { type: String, maxlength: 100 },
      description: { type: String, maxlength: 300 },
    },
  },
  { timestamps: true }
);

serviceSchema.index({ active: 1, order: 1 });

export const Service = mongoose.model('Service', serviceSchema);
