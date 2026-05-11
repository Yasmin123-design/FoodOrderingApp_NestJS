import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { GetCurrentUserId, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role, PaymentMethod } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from '../../images/images.service';

@UseGuards(RolesGuard)
@Roles(Role.CUSTOMER)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly imagesService: ImagesService,
  ) {}

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         cb(null, `${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //   }),
  // )
  // async create(
  //   @GetCurrentUserId() userId: string,
  //   @Body() createOrderDto: CreateOrderDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   if (createOrderDto.paymentMethod === PaymentMethod.ONLINE && !file) {
  //     throw new BadRequestException('Payment proof is required for online payment');
  //   }
  //   if (file) {
  //     createOrderDto.paymentProof = await this.imagesService.handleUpload(file);
  //   }
  //   return this.ordersService.create(userId, createOrderDto);
  // }

  @Post('checkout')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async checkout(
    @GetCurrentUserId() userId: string,
    @Body() checkoutDto: CheckoutDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (checkoutDto.paymentMethod === PaymentMethod.ONLINE && !file) {
      throw new BadRequestException(
        'Payment proof is required for online payment',
      );
    }
    if (file) {
      checkoutDto.paymentProof = await this.imagesService.handleUpload(file);
    }
    return this.ordersService.checkout(userId, checkoutDto);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id);
  }
}
