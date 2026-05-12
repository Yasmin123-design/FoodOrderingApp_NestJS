import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    return this.create(userId, {
      ...dto,
      items: orderItems,
    });
  }

  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('Some products were not found');
    }

    const existingOrder = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.PENDING,
      },
      include: {
        orderItems: true,
      },
    });

    if (existingOrder) {
      let addedAmount = 0;

      for (const itemDto of dto.items) {
        const product = products.find((p) => p.id === itemDto.productId);
        if (!product) continue;

        const itemPrice = product.price * itemDto.quantity;
        addedAmount += itemPrice;

        const existingItem = existingOrder.orderItems.find(
          (oi) => oi.productId === itemDto.productId,
        );

        if (existingItem) {
          await this.prisma.orderItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + itemDto.quantity,
              price: product.price,
            },
          });
        } else {
          await this.prisma.orderItem.create({
            data: {
              orderId: existingOrder.id,
              productId: itemDto.productId,
              quantity: itemDto.quantity,
              price: product.price,
            },
          });
        }
      }

      return this.prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          totalAmount: existingOrder.totalAmount + addedAmount,
          address: dto.address,
          paymentProof: dto.paymentProof,
        },
        include: {
          orderItems: { include: { product: true } },
        },
      });
    }

    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        address: dto.address,
        paymentMethod: dto.paymentMethod,
        paymentProof: dto.paymentProof,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear the user's cart after successful order
    await this.prisma.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });

    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
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

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(userId: string, id: string, status: OrderStatus) {
    const order = await this.findOne(userId, id);

    // If it's a customer, we might want to restrict what they can change.
    // But as requested, I will allow changing to any status.
    
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
