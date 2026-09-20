import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(200),
  photo: z
    .object({ url: z.string().url().optional(), publicId: z.string().optional() })
    .optional()
    .default({}),
  role: z.string().trim().min(2).max(200),
  experienceText: z.string().max(300).optional().default(''),
  specialty: z.string().max(300).optional().default(''),
  technologies: z.array(z.string()).optional().default([]),
  bio: z.string().max(5000).optional().default(''),
  projectIds: z.array(z.string()).optional().default([]),
  socials: z
    .object({
      linkedin: z.string().max(500).optional(),
      github: z.string().max(500).optional(),
      twitter: z.string().max(500).optional(),
      website: z.string().max(500).optional(),
    })
    .optional()
    .default({}),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const updateTeamMemberSchema = teamMemberSchema.partial();
