import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true },
    branding: {
      agencyName: { type: String, default: 'Your Agency' },
      tagline: { type: String, default: '' },
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#0B1220' },
      accentColor: { type: String, default: '#5B8CFF' },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      address: { type: String, default: '' },
      businessHours: { type: String, default: '' },
    },
    socials: {
      linkedin: String,
      twitter: String,
      instagram: String,
      github: String,
      facebook: String,
      youtube: String,
    },
    seoDefaults: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    analytics: {
      enabled: { type: Boolean, default: true },
      provider: { type: String, default: 'first-party' },
      writeKeyConfigured: { type: Boolean, default: false },
    },
    ctaLabels: {
      primary: { type: String, default: 'Start Your Project' },
      secondary: { type: String, default: 'View Our Work' },
    },
    featureFlags: {
      maintenanceMode: { type: Boolean, default: false },
      showTestimonials: { type: Boolean, default: true },
    },
    enquiryConfirmationMessage: {
      type: String,
      default:
        "Thanks! Your project request has been received. We'll review your requirements and get back to you soon.",
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
