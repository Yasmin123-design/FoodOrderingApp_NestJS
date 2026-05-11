import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';

let app: NestExpressApplication;

export default async function (req: any, res: any) {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useGlobalFilters(new PrismaExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  }
  
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
