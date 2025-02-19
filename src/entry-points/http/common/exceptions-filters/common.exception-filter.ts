import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ZodSerializationException, ZodValidationException } from 'nestjs-zod';

@Catch(HttpException)
export class CommonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CommonExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      this.logger.error(`ZodSerializationException: ${zodError.message}`);
    }

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      this.logger.error(`ZodValidationException: ${zodError.message}`);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
