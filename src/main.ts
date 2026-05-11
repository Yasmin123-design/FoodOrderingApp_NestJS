import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/images/files/' });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
