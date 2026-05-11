import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(categoryId, search);
  }

  @Roles(Role.CUSTOMER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
