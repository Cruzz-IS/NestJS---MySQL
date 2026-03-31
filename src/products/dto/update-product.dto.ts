import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, ProductStatus } from './create-product.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
