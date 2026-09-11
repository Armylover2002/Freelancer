import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(6).max(200),
});

export const createAdminUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
  role: z.enum(['owner', 'admin', 'staff']).default('admin'),
});

export const updateAdminUserSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(['owner', 'admin', 'staff']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
});
