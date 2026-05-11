import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            price: true,
            image: true,
          },
        },
      },
    });
  }
}
