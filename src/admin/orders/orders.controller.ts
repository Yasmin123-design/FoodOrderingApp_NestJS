import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/order.dto';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
