import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  photo: z
    .object({ url: z.string().url().optional(), publicId: z.string().optional() })
    .optional()
    .default({}),
  role: z.string().trim().min(2).max(120),
  experienceText: z.string().max(120).optional().default(''),
  specialty: z.string().max(150).optional().default(''),
  technologies: z.array(z.string().max(60)).optional().default([]),
  bio: z.string().max(2000).optional().default(''),
  projectIds: z.array(z.string()).optional().default([]),
  socials: z
    .object({
      linkedin: z.string().max(300).optional(),
      github: z.string().max(300).optional(),
      twitter: z.string().max(300).optional(),
      website: z.string().max(300).optional(),
    })
    .optional()
    .default({}),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const updateTeamMemberSchema = teamMemberSchema.partial();
