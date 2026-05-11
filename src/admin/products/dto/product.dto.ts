import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
