import { z } from 'zod';

const fileRef = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  originalName: z.string().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});

export const createEnquirySchema = z.object({
  contact: z.object({
    name: z.string().trim().min(2, 'Name is required').max(120),
    business: z.string().trim().max(150).optional().default(''),
    email: z.string().trim().email('Enter a valid email').max(200),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .max(30)
      .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
    country: z.string().trim().max(80).optional().default(''),
    preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  }),
  business: z
    .object({
      description: z.string().max(3000).optional().default(''),
      targetCustomers: z.string().max(1000).optional().default(''),
      existingUrl: z.string().max(500).optional().default(''),
      painPoint: z.string().max(2000).optional().default(''),
    })
    .optional()
    .default({}),
  projectType: z.enum([
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
  ]),
  pages: z.array(z.string().max(60)).max(30).optional().default([]),
  features: z.array(z.string().max(60)).max(40).optional().default([]),
  design: z
    .object({
      style: z
        .enum(['modern', 'minimal', 'corporate', 'luxury', 'bold', 'creative', 'tech', 'recommend'])
        .default('recommend'),
      referenceUrls: z.array(z.string().url().max(500)).max(10).optional().default([]),
      brandAssets: z.array(fileRef).max(10).optional().default([]),
    })
    .optional()
    .default({}),
  budgetRange: z.enum(['10-25K', '25-50K', '50K-1L', '1-2L', '2L+', 'not_sure']),
  timeline: z.enum(['asap', '2-4_weeks', '1-2_months', '2-3_months', 'flexible']),
  brief: z.string().max(4000).optional().default(''),
  heardFrom: z.string().max(150).optional().default(''),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted about your request' }),
  }),
  files: z.array(fileRef).max(10).optional().default([]),
  // Honeypot field: must always be empty. Real users never see/fill this input.
  website: z.string().max(0).optional().default(''),
  source: z
    .object({
      utmSource: z.string().max(100).optional(),
      utmMedium: z.string().max(100).optional(),
      utmCampaign: z.string().max(100).optional(),
      utmTerm: z.string().max(100).optional(),
      utmContent: z.string().max(100).optional(),
      referrer: z.string().max(500).optional(),
      landingPage: z.string().max(500).optional(),
    })
    .optional()
    .default({}),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'CONTACTED',
    'DISCOVERY_CALL',
    'PROPOSAL_SENT',
    'NEGOTIATION',
    'WON',
    'LOST',
    'PROJECT',
  ]),
  note: z.string().max(2000).optional(),
});

export const addEnquiryNoteSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});

export const updateEnquirySchema = z.object({
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignee: z.string().nullable().optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  followUpDate: z.string().datetime().nullable().optional(),
  estimatedValue: z.number().min(0).nullable().optional(),
  archived: z.boolean().optional(),
});

export const enquiryQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  search: z.string().optional(),
  archived: z.string().optional(),
  sort: z.string().optional(),
});
