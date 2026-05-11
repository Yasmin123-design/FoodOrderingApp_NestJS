import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryProvider],
  exports: [ImagesService, CloudinaryProvider],
})
export class ImagesModule {}
