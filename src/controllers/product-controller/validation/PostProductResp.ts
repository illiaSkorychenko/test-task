import { createZodDto } from 'nestjs-zod';
import { ProductSchema } from '../../../types/entities/Product';

export const PostProductRespSchema = ProductSchema;

export class PostProductRespDto extends createZodDto(PostProductRespSchema) {}
