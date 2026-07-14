import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(1),
  type: z.coerce.number().int().min(0).max(1),
  icon: z.string().trim().min(1),
  color: z.string().trim().min(1),
});

export const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  limitAmount: z.coerce.number().gt(0),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int(),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1),
  avatar: z.string(),
});
