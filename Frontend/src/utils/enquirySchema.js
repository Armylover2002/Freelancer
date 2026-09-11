import { z } from 'zod';

export const enquiryFormSchema = z.object({
  // Step 1 - Contact
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  business: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address').max(200),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(30)
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),

  // Step 2 - Business
  businessDescription: z.string().max(3000).optional().or(z.literal('')),
  targetCustomers: z.string().max(1000).optional().or(z.literal('')),
  existingUrl: z.string().max(500).optional().or(z.literal('')),
  painPoint: z.string().max(2000).optional().or(z.literal('')),

  // Step 3 - Project
  projectType: z.enum([
    'business_website', 'ecommerce', 'portfolio', 'landing_page',
    'web_app', 'saas', 'booking', 'dashboard', 'redesign', 'other',
  ], { errorMap: () => ({ message: 'Select a project type' }) }),

  // Step 4 - Scope
  pages: z.array(z.string()).optional().default([]),

  // Step 5 - Features
  features: z.array(z.string()).optional().default([]),

  // Step 6 - Design
  designStyle: z.enum(['modern', 'minimal', 'corporate', 'luxury', 'bold', 'creative', 'tech', 'recommend']),
  referenceUrls: z.array(z.string()).optional().default([]),
  brandAssets: z.array(z.object({ url: z.string(), publicId: z.string().optional(), originalName: z.string().optional() })).optional().default([]),

  // Step 7 - Commercial
  budgetRange: z.enum(['10-25K', '25-50K', '50K-1L', '1-2L', '2L+', 'not_sure'], {
    errorMap: () => ({ message: 'Select a budget range' }),
  }),
  timeline: z.enum(['asap', '2-4_weeks', '1-2_months', '2-3_months', 'flexible'], {
    errorMap: () => ({ message: 'Select a timeline' }),
  }),

  // Step 8 - Brief
  brief: z.string().max(4000).optional().or(z.literal('')),
  heardFrom: z.string().max(150).optional().or(z.literal('')),
  consent: z.literal(true, { errorMap: () => ({ message: 'You must consent to be contacted' }) }),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
});

export const STEP_FIELDS = [
  ['name', 'email', 'phone', 'preferredContactMethod', 'business', 'country'],
  ['businessDescription', 'targetCustomers', 'existingUrl', 'painPoint'],
  ['projectType'],
  ['pages'],
  ['features'],
  ['designStyle', 'referenceUrls', 'brandAssets'],
  ['budgetRange', 'timeline'],
  ['brief', 'heardFrom', 'consent'],
];

export function toApiPayload(values) {
  return {
    contact: {
      name: values.name,
      business: values.business || '',
      email: values.email,
      phone: values.phone,
      country: values.country || '',
      preferredContactMethod: values.preferredContactMethod,
    },
    business: {
      description: values.businessDescription || '',
      targetCustomers: values.targetCustomers || '',
      existingUrl: values.existingUrl || '',
      painPoint: values.painPoint || '',
    },
    projectType: values.projectType,
    pages: values.pages || [],
    features: values.features || [],
    design: {
      style: values.designStyle,
      referenceUrls: (values.referenceUrls || []).filter(Boolean),
      brandAssets: values.brandAssets || [],
    },
    budgetRange: values.budgetRange,
    timeline: values.timeline,
    brief: values.brief || '',
    heardFrom: values.heardFrom || '',
    consent: values.consent,
    website: values.website || '',
  };
}

export const DEFAULT_VALUES = {
  name: '', business: '', email: '', phone: '', country: '', preferredContactMethod: 'email',
  businessDescription: '', targetCustomers: '', existingUrl: '', painPoint: '',
  projectType: undefined,
  pages: [],
  features: [],
  designStyle: 'recommend', referenceUrls: [], brandAssets: [],
  budgetRange: undefined, timeline: undefined,
  brief: '', heardFrom: '', consent: false, website: '',
};
