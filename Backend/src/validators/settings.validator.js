import { z } from 'zod';

export const siteSettingsSchema = z.object({
  branding: z
    .object({
      agencyName: z.string().max(150).optional(),
      tagline: z.string().max(250).optional(),
      logoUrl: z.string().max(500).optional(),
      faviconUrl: z.string().max(500).optional(),
      primaryColor: z.string().max(20).optional(),
      accentColor: z.string().max(20).optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().email().max(200).optional().or(z.literal('')),
      phone: z.string().max(30).optional(),
      whatsapp: z.string().max(30).optional(),
      address: z.string().max(300).optional(),
      businessHours: z.string().max(150).optional(),
    })
    .optional(),
  socials: z
    .object({
      linkedin: z.string().max(300).optional(),
      twitter: z.string().max(300).optional(),
      instagram: z.string().max(300).optional(),
      github: z.string().max(300).optional(),
      facebook: z.string().max(300).optional(),
      youtube: z.string().max(300).optional(),
    })
    .optional(),
  seoDefaults: z
    .object({
      title: z.string().max(70).optional(),
      description: z.string().max(160).optional(),
      ogImage: z.string().max(500).optional(),
    })
    .optional(),
  ctaLabels: z
    .object({
      primary: z.string().max(60).optional(),
      secondary: z.string().max(60).optional(),
    })
    .optional(),
  featureFlags: z
    .object({
      maintenanceMode: z.boolean().optional(),
      showTestimonials: z.boolean().optional(),
    })
    .optional(),
  enquiryConfirmationMessage: z.string().max(500).optional(),
  legal: z
    .object({
      privacyPolicy: z.string().max(20000).optional().or(z.literal('')),
      termsOfService: z.string().max(20000).optional().or(z.literal('')),
    })
    .optional(),
});
