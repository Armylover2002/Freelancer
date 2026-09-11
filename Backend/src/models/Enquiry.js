import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    originalName: String,
    format: String,
    bytes: Number,
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    authorName: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // status_change | note_added | assigned | created
    fromStatus: String,
    toStatus: String,
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    actorName: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export const ENQUIRY_STATUSES = [
  'NEW',
  'CONTACTED',
  'DISCOVERY_CALL',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
  'PROJECT',
];

const enquirySchema = new mongoose.Schema(
  {
    // Step 1: Contact
    contact: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      business: { type: String, trim: true, maxlength: 150, default: '' },
      email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
      phone: { type: String, required: true, trim: true, maxlength: 30 },
      country: { type: String, trim: true, maxlength: 80, default: '' },
      preferredContactMethod: {
        type: String,
        enum: ['email', 'phone', 'whatsapp'],
        default: 'email',
      },
    },

    // Step 2: Business
    business: {
      description: { type: String, maxlength: 3000, default: '' },
      targetCustomers: { type: String, maxlength: 1000, default: '' },
      existingUrl: { type: String, maxlength: 500, default: '' },
      painPoint: { type: String, maxlength: 2000, default: '' },
    },

    // Step 3: Project
    projectType: {
      type: String,
      enum: [
        'business_website',
        'ecommerce',
        'portfolio',
        'landing_page',
        'web_app',
        'saas',
        'booking',
        'dashboard',
        'redesign',
        'other',
      ],
      required: true,
    },

    // Step 4: Scope
    pages: [{ type: String, trim: true, maxlength: 60 }],

    // Step 5: Features
    features: [{ type: String, trim: true, maxlength: 60 }],

    // Step 6: Design
    design: {
      style: {
        type: String,
        enum: ['modern', 'minimal', 'corporate', 'luxury', 'bold', 'creative', 'tech', 'recommend'],
        default: 'recommend',
      },
      referenceUrls: [{ type: String, trim: true, maxlength: 500 }],
      brandAssets: [fileSchema],
    },

    // Step 7: Commercial
    budgetRange: {
      type: String,
      enum: ['10-25K', '25-50K', '50K-1L', '1-2L', '2L+', 'not_sure'],
      required: true,
    },
    timeline: {
      type: String,
      enum: ['asap', '2-4_weeks', '1-2_months', '2-3_months', 'flexible'],
      required: true,
    },

    // Step 8: Brief
    brief: { type: String, maxlength: 4000, default: '' },
    heardFrom: { type: String, maxlength: 150, default: '' },
    consent: { type: Boolean, required: true },

    files: [fileSchema],

    // Source / UTM tracking
    source: {
      utmSource: String,
      utmMedium: String,
      utmCampaign: String,
      utmTerm: String,
      utmContent: String,
      referrer: String,
      landingPage: String,
      userAgent: String,
      ipHash: String,
    },

    // Lead pipeline
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'NEW', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    followUpDate: { type: Date },
    estimatedValue: { type: Number, min: 0 },
    notes: [noteSchema],
    activity: [activitySchema],
    archived: { type: Boolean, default: false, index: true },

    // Notification tracking
    notification: {
      adminEmailSent: { type: Boolean, default: false },
      clientEmailSent: { type: Boolean, default: false },
      providerMessageId: String,
    },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ 'contact.email': 1 });
enquirySchema.index({ archived: 1, status: 1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
