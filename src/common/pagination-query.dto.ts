import { Type } from '@nestjs/class-transformer';
import {
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @MinLength(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @MinLength(1)
  @MaxLength(100)
  limit: number = 10;
}
