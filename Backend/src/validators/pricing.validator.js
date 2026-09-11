import { z } from 'zod';

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(2).max(100),
  startingPrice: z.number().min(0),
  currency: z.string().max(6).optional().default('INR'),
  billingUnit: z.string().max(40).optional().default('project'),
  features: z.array(z.string().max(200)).optional().default([]),
  exclusions: z.array(z.string().max(200)).optional().default([]),
  timeline: z.string().max(120).optional().default(''),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const updatePricingPlanSchema = pricingPlanSchema.partial();
