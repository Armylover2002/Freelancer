import { z } from 'zod';

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  company: z.string().max(150).optional().default(''),
  role: z.string().max(120).optional().default(''),
  quote: z.string().trim().min(5).max(1000),
  rating: z.number().min(1).max(5).optional().default(5),
  photo: z
    .object({ url: z.string().url().optional(), publicId: z.string().optional() })
    .optional()
    .default({}),
  projectId: z.string().nullable().optional(),
  sourceVerified: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

export const updateTestimonialSchema = testimonialSchema.partial();
