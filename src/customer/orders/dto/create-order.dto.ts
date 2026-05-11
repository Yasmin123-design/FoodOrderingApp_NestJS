import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  paymentProof?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
