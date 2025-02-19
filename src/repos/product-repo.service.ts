import { Inject, Injectable } from '@nestjs/common';
import { DB_CONNECTION_TOKEN } from '../db/db.module';
import { ProductSchema } from '../types/entities/Product';
import { DbException } from '../types/exceptions/DBExaption';
import { ProductRepo } from '../types/interfaces/repos/ProductRepo';
import { Client } from 'pg';
import { CreateProductDto } from '../types/dtos/product/CreateProductDto';
import { PaginationDto } from '../types/dtos/common/PaginationDto';

@Injectable()
export class ProductRepoService implements ProductRepo {
  constructor(
    @Inject(DB_CONNECTION_TOKEN)
    private client: Client
  ) {}

  async getAll(paginationOpt: PaginationDto) {
    try {
      const resp = await this.client.query('SELECT * FROM products LIMIT $1 OFFSET $2', [
        paginationOpt.limit,
        paginationOpt.offset
      ]);

      return ProductSchema.array().parse(resp.rows);
    } catch (err) {
      throw new DbException('Error while fetching products', err);
    }
  }

  async count() {
    try {
      const resp = await this.client.query('SELECT COUNT(id) as "count" FROM products');

      return parseInt(resp.rows[0].count);
    } catch (err) {
      throw new DbException('Error while fetching products', err);
    }
  }

  async create(data: CreateProductDto) {
    try {
      const resp = await this.client.query(
        'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
        [data.name, data.price, data.description]
      );

      return ProductSchema.parse(resp.rows[0]);
    } catch (err) {
      throw new DbException('Error while creating product', err);
    }
  }

  async deleteByIdOrFail(id: string) {
    try {
      const resp = await this.client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

      if (!resp.rowCount) {
        throw new Error('Product not deleted');
      }
    } catch (err) {
      throw new DbException('Error while deleting product', err);
    }
  }
}
