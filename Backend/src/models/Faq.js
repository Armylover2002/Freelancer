import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, maxlength: 3000 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

faqSchema.index({ published: 1, category: 1, order: 1 });

export const Faq = mongoose.model('Faq', faqSchema);
