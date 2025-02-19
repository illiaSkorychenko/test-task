import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { IdParamSchema } from '../../common/validation/IdParam';

export const DeleteProductParamSchema = z.object({
  productId: IdParamSchema
});

export class DeleteProductParamDto extends createZodDto(DeleteProductParamSchema) {}
