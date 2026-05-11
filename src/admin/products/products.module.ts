import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ImagesModule } from '../../images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class AdminProductsModule {}
