import { z } from 'zod';

export const faqSchema = z.object({
  category: z.string().trim().min(2).max(80),
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(3000),
  order: z.number().optional().default(0),
  published: z.boolean().optional().default(true),
});

export const updateFaqSchema = faqSchema.partial();
