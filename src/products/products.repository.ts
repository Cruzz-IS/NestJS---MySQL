import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2/promise';
import { BaseRepository } from 'src/common/base.repository';
import { mapSpError } from 'src/common/sp-error.mapper';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository extends BaseRepository {
  async getAllProducts(
    page: number,
    limit: number,
    search?: string,
    category_id?: number,
  ) {
    try {
      const sets = await this.call('sp_products_find_all', [
        page,
        limit,
        search,
        category_id,
      ]);
      const rows = sets[0] as RowDataPacket[] | undefined;
      const total =
        ((sets[1]?.[0] as RowDataPacket | undefined)?.total as number) ?? 0;
      return { rows, total };
    } catch (e) {
      mapSpError(e);
    }
  }

  async getProductById(id: number) {
    try {
      const sets = await this.call('sp_products_find_by_id', [id]);
      return (sets[0]?.[0] as RowDataPacket | undefined) ?? null;
    } catch (e) {
      mapSpError(e);
    }
  }

  async createProduct(dto: CreateProductDto) {
    try {
      const sets = await this.call('sp_products_create', [
        dto.name,
        dto.sku,
        dto.price,
        dto.stock,
        dto.category_id,
      ]);
      return sets[0]?.[0];
    } catch (e) {
      mapSpError(e);
    }
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    try {
      const sets = await this.call('sp_products_update', [
        id,
        dto.name ?? null,
        dto.sku ?? null,
        dto.price ?? null,
        dto.stock ?? null,
        dto.category_id ?? null,
      ]);
      return sets[0]?.[0] as RowDataPacket | undefined;
    } catch (e) {
      mapSpError(e);
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.call('sp_products_delete', [id]);
    } catch (e) {
      mapSpError(e);
    }
  }
}
