import { createZodDto } from 'nestjs-zod';
import { ProductSchema } from '../../../types/entities/Product';
import { z } from 'zod';

export const GetProductRespSchema = z.object({
  products: ProductSchema.array(),
  count: z.number().int()
});

export class GetProductRespDto extends createZodDto(GetProductRespSchema) {}
