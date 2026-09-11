import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    business: { type: String, trim: true, maxlength: 150, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    country: { type: String, trim: true, maxlength: 80, default: '' },
    sourceEnquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    notes: [
      {
        text: { type: String, maxlength: 2000 },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

clientSchema.index({ email: 1 });

export const Client = mongoose.model('Client', clientSchema);
