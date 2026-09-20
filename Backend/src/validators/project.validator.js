import { z } from 'zod';

const imageRef = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  altText: z.string().max(200).optional().default(''),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(150),
  businessType: z.string().trim().max(150).optional().default(''),
  category: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(10).max(300),
  problem: z.string().max(4000).optional().default(''),
  solution: z.string().max(4000).optional().default(''),
  features: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).optional().default([]),
  timeline: z.string().max(120).optional().default(''),
  coverImage: imageRef.optional(),
  screenshots: z.array(imageRef).optional().default([]),
  liveUrl: z.string().max(500).optional().default(''),
  playStoreUrl: z.string().max(500).optional().default(''),
  results: z.string().max(2000).optional().default(''),
  isFeatured: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  order: z.number().optional().default(0),
  seo: z
    .object({
      title: z.string().max(70).optional(),
      description: z.string().max(160).optional(),
    })
    .optional()
    .default({}),
});

export const updateProjectSchema = projectSchema.partial();
