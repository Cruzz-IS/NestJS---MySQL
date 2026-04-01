import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, ProductQueryDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      return await this.repo.createProduct(createProductDto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(
        `Error al agregar un producto: ${message}`,
      );
    }
  }

  async getAllProducts(query: ProductQueryDto) {
    const { rows, total } = await this.repo.getAllProducts(
      query.page,
      query.limit,
      query.search,
      query.category_id,
    );
    return {
      data: rows,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getproductById(id: number) {
    const product = await this.repo.getProductById(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.repo.updateProduct(id, updateProductDto);
  }

  async removeProduct(id: number): Promise<void> {
    await this.repo.deleteProduct(id);
  }
}
