import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ImagesService } from '../../images/images.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.image && product.image && dto.image !== product.image) {
      await this.imagesService.deleteImage(product.image);
    }

    return this.prisma.product.update({
      where: { id: product.id },
      data: dto,
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (product.image) {
      await this.imagesService.deleteImage(product.image);
    }

    return this.prisma.product.delete({
      where: { id: product.id },
    });
  }
}
