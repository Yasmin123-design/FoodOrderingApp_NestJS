import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ImagesModule } from '../../images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class AdminCategoriesModule {}
