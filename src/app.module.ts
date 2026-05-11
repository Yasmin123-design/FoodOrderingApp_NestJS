import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './common/guards/at.guard';
import { AdminCategoriesModule } from './admin/categories/categories.module';
import { AdminProductsModule } from './admin/products/products.module';
import { AdminOrdersModule } from './admin/orders/orders.module';
import { AdminDashboardModule } from './admin/dashboard/dashboard.module';
import { CustomerCategoriesModule } from './customer/categories/categories.module';
import { CustomerProductsModule } from './customer/products/products.module';
import { CustomerOrdersModule } from './customer/orders/orders.module';
import { CartModule } from './customer/cart/cart.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    AdminCategoriesModule,
    AdminProductsModule,
    AdminOrdersModule,
    AdminDashboardModule,
    CustomerCategoriesModule,
    CustomerProductsModule,
    CustomerOrdersModule,
    CartModule,
    ImagesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
