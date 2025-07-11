import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
// eslint-disable-next-line n/no-extraneous-import
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.originalUrl;
    const body = req.body as Record<string, unknown>;
    const now = Date.now();
    return next.handle().pipe(
      tap((response: any) => {
        const delay = Date.now() - now;

        const msg = `HTTP Request: method=${method}, url=${url}, body=${JSON.stringify(body)}, response=${JSON.stringify(response)}, delay=${delay}ms`;
        this.logger.info(msg);
      }),
    );
  }
}
