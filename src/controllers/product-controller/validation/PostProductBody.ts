import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PostProductBodySchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().int().positive(),
  description: z.string().max(255).nullish()
});

export class PostProductBodyDto extends createZodDto(PostProductBodySchema) {}
