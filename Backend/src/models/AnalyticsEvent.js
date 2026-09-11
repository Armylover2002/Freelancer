import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'project_cta_click',
        'enquiry_start',
        'enquiry_submit',
        'contact_click',
      ],
      index: true,
    },
    path: { type: String, maxlength: 300 },
    referrer: { type: String, maxlength: 500 },
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String,
    },
    device: { type: String, maxlength: 40 },
    sessionId: { type: String, maxlength: 100, index: true },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

analyticsEventSchema.index({ type: 1, createdAt: -1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
