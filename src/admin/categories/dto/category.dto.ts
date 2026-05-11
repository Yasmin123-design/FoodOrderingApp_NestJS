import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
