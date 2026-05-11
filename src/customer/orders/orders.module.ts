import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ImagesModule } from '../../images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class CustomerOrdersModule {}
