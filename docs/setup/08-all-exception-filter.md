---

## 🧾 Error Logging in Winston + Global Exception Filter in NestJS

This documentation explains how to:

1. Extend the **Winston logger** to persist errors in a separate log file
2. Create a **global exception filter** that logs all unhandled exceptions
3. **Register the filter** in a NestJS app for full global coverage

---

### 📦 Dependencies

Install once:

```bash
npm install winston winston-daily-rotate-file
```

---

## 1️⃣ Winston LoggerService: Split Logs by Type

We added a second file transport to store all error logs in a dedicated folder.

📄 `logger.service.ts`

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
    const requestTransport = new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'requests'),
      filename: '%DATE%',
      datePattern: 'YYYY/MM/DD',
      maxFiles: '14d',
    });

    const errorTransport = new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'errors'),
      filename: '%DATE%',
      datePattern: 'YYYY/MM/DD',
      maxFiles: '30d',
      level: 'error',
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
        requestTransport,
        errorTransport,
        new winston.transports.Console(),
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

### ✅ Resulting Logs

- **`logs/requests/YYYY/MM/DD.log`** → all requests and responses
- **`logs/errors/YYYY/MM/DD.log`** → all uncaught or thrown errors

---

## 2️⃣ Global Exception Filter for Error Capture

📄 `all-exception.filter.ts`

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : String(exception);

    this.logger.error({
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: status,
      message,
    });

    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
```

---

## 3️⃣ Register the Filter Globally

### ✅ In AppModule (recommended)

📄 `app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerService } from 'src/logger/logger.service';
import { AllExceptionsFilter } from 'src/shared/filters/all-exception.filter';

@Module({
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```
