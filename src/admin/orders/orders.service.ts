import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: dto.status },
    });
  }
}
