import { z } from 'zod';

export const analyticsEventSchema = z.object({
  type: z.enum(['page_view', 'project_cta_click', 'enquiry_start', 'enquiry_submit', 'contact_click']),
  path: z.string().max(300).optional().default(''),
  referrer: z.string().max(500).optional().default(''),
  utm: z
    .object({
      source: z.string().max(100).optional(),
      medium: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
      term: z.string().max(100).optional(),
      content: z.string().max(100).optional(),
    })
    .optional()
    .default({}),
  device: z.string().max(40).optional().default(''),
  sessionId: z.string().max(100).optional().default(''),
  meta: z.record(z.any()).optional(),
});
