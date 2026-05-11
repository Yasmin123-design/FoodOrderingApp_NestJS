import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception.message.replace(/\n/g, '');
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[]) || [];
        message = `Unique constraint failed on the fields: (${target.join(', ')})`;
        if (target.includes('nameEn')) message = 'English name already exists';
        if (target.includes('nameAr')) message = 'Arabic name already exists';
        if (target.includes('email')) message = 'Email already exists';
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = (exception.meta?.cause as string) || 'Record not found';
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed. Related record not found.';
        break;
      }
      default:
        // Handle other Prisma error codes if needed
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.code,
    });
  }
}
