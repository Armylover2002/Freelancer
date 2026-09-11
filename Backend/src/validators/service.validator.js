import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(120),
  icon: z.string().max(60).optional().default(''),
  shortDescription: z.string().trim().min(5).max(200),
  description: z.string().max(4000).optional().default(''),
  features: z.array(z.string().max(200)).optional().default([]),
  startingPrice: z.number().min(0).optional(),
  timeline: z.string().max(120).optional().default(''),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
  seo: z
    .object({
      title: z.string().max(70).optional(),
      description: z.string().max(160).optional(),
    })
    .optional()
    .default({}),
});

export const updateServiceSchema = serviceSchema.partial();
