import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  description: z.string().nullable(),
  createdAt: z.date()
});

export type Product = z.infer<typeof ProductSchema>;