import { PaginationDto } from '../../dtos/common/PaginationDto';
import { CreateProductDto } from '../../dtos/product/CreateProductDto';
import { Product } from '../../entities/Product';

export interface ProductRepo {
  getAll(paginationOpt: PaginationDto): Promise<Product[]>;
  count(): Promise<number>;
  create(data: CreateProductDto): Promise<Product>;
  deleteByIdOrFail(id: string): Promise<void>;
}
