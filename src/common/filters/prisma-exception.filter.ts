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
        
        let fieldName = 'Record';
        if (Array.isArray(target) && target.length > 0) {
          fieldName = target.join(', ');
          if (target.includes('nameEn')) message = 'English name already exists';
          else if (target.includes('nameAr')) message = 'Arabic name already exists';
          else if (target.includes('email')) message = 'Email already exists';
          else message = `This ${fieldName} already exists.`;
        } else if (typeof target === 'string') {
          message = `This ${target} already exists.`;
        } else {
          message = 'This record already exists. Please use a different value.';
        }
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
