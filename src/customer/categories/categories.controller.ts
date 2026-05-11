import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}
