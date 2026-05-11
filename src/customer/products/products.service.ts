import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, search?: string) {
    return this.prisma.product.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          search ? {
            OR: [
              { nameEn: { contains: search, mode: 'insensitive' } },
              { nameAr: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
        ]
      },
      include: {
        category: {
          select: {
            nameEn: true,
            nameAr: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
