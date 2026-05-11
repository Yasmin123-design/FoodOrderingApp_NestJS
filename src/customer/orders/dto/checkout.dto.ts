import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  paymentProof?: string;
}
