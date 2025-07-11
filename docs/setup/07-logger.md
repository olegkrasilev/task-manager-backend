# LoggerService and LoggingInterceptor — Full Documentation and Setup Guide

---

## 1. Introduction

This guide explains how to implement detailed HTTP request and response logging in a NestJS app using a custom `LoggerService` (based on Winston) and a `LoggingInterceptor`. Logs include HTTP method, URL, request body, response data, and processing time. Logs are saved daily into rotating files and printed in the console.

---

## 2. Installation

### Required packages

Install Winston and the daily rotate file transport:

```bash
npm install winston winston-daily-rotate-file
```

If not installed, also install Express types (used for typing request):

```bash
npm install --save-dev @types/express
```

---

## 3. LoggerService

### Purpose

- Central logging service wrapping Winston.
- Writes logs to daily rotated files in `logs/YYYY/MM/DD` folders.
- Outputs logs to console with timestamps and colors.
- Supports `info` and `error` log levels.

### Code explanation

- `DailyRotateFile` transport manages log rotation by date.
- Log format combines timestamp, uppercase level, and serialized message.
- Type guard `isString` ensures safe message formatting.
- Console transport formats logs similarly, without colors in files.

### Sample snippet

```ts
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transport = new winston.transports.DailyRotateFile({
      dirname: path.join('logs'),
      filename: '%DATE%',
      datePattern: 'YYYY/MM/DD',
      maxFiles: '14d',
      zippedArchive: false,
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          const time = isString(timestamp)
            ? timestamp
            : new Date().toISOString();
          const msg = isString(message) ? message : JSON.stringify(message);
          return `[${time}] ${level.toUpperCase()}: ${msg}`;
        }),
      ),
      transports: [
        transport,
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
              const time = isString(timestamp)
                ? timestamp
                : new Date().toISOString();
              const msg = isString(message) ? message : JSON.stringify(message);
              return `[${time}] ${level.toUpperCase()}: ${msg}`;
            }),
          ),
        }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
```

---

## 4. LoggingInterceptor

### Purpose

- Intercepts all HTTP requests and responses.
- Logs HTTP method, URL, request body, response, and processing time.
- Uses typed Express `Request` object.
- Calls `LoggerService` to log structured message.

### Code explanation

- Extracts request details from `ExecutionContext`.
- Uses RxJS `tap` to log response after controller handling.
- Measures duration between request start and response finish.
- Serializes body and response safely.

### Sample snippet

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
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
```

---

## 5. Setup in `main.ts`

Register the interceptor globally so it applies to all routes.

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable JSON body parsing middleware if not already enabled
  app.use(express.json());

  // Get LoggerService instance
  const loggerService = app.get(LoggerService);

  // Register LoggingInterceptor globally
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));

  await app.listen(3000);
}
bootstrap();
```

---

## 6. How it works

- Every incoming HTTP request passes through `LoggingInterceptor`.
- The interceptor captures request details and timestamp.
- After request handling, response and elapsed time are logged.
- `LoggerService` writes logs to daily files and console.
- Log files are organized by year/month/day for easy maintenance.

---
