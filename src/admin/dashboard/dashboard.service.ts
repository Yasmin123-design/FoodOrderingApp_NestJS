import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalOrders, totalProducts, totalCategories, totalUsers] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.user.count(),
    ]);

    const salesResult = await this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: 'DELIVERED',
      },
    });

    return {
      totalOrders,
      totalProducts,
      totalCategories,
      totalUsers,
      totalRevenue: salesResult._sum.totalAmount || 0,
    };
  }
}
