import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ImagesService } from '../../images/images.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.image && category.image && dto.image !== category.image) {
      await this.imagesService.deleteImage(category.image);
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: dto,
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (category.image) {
      await this.imagesService.deleteImage(category.image);
    }

    return this.prisma.category.delete({
      where: { id: category.id },
    });
  }
}
