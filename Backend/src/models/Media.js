import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, default: 'image' },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    altText: { type: String, default: '', maxlength: 200 },
    folder: { type: String, default: 'agency' },
    tags: [{ type: String, trim: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaSchema);
