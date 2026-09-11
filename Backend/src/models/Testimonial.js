import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: '', trim: true, maxlength: 150 },
    role: { type: String, default: '', trim: true, maxlength: 120 },
    quote: { type: String, required: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photo: {
      url: String,
      publicId: String,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    // Marks that the agency has verified this testimonial came from a genuine client.
    sourceVerified: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ published: 1, order: 1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
