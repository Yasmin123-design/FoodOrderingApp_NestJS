import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { GetCurrentUserId } from '../../common/decorators';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@GetCurrentUserId() userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  addToCart(
    @GetCurrentUserId() userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Delete('item/:productId')
  removeItem(
    @GetCurrentUserId() userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete('clear')
  clearCart(@GetCurrentUserId() userId: string) {
    return this.cartService.clearCart(userId);
  }
  @Patch('item/:productId/increment')
  incrementItem(
    @GetCurrentUserId() userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.updateQuantity(userId, productId, 'increment');
  }

  @Patch('item/:productId/decrement')
  decrementItem(
    @GetCurrentUserId() userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.updateQuantity(userId, productId, 'decrement');
  }
}
