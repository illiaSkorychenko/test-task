import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LimitSchema = z.coerce.number().int().positive().max(100).default(10);
export const OffsetSchema = z.coerce.number().int().min(0).default(0);

export const PaginationQuerySchema = z.object({
  limit: LimitSchema,
  offset: OffsetSchema
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
