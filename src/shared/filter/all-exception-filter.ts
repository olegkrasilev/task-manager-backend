import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
// eslint-disable-next-line n/no-extraneous-import
import { Request, Response } from 'express';

import { LoggerService } from '../../logger/logger.service';

@Catch()
@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    const errorPayload = {
      method: req.method,
      url: req.originalUrl,
      statusCode: status,
      message,
      stack,
    };

    this.logger.error(errorPayload);

    res.status(status).json({
      statusCode: status,
    });
  }
}
