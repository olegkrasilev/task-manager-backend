---

# 📌 Cheat Sheet: `HttpExceptionFilter` for NestJS

## 🎯 Purpose

Custom filter to return detailed errors in development, and minimal output in production.

* In **development** (`NODE_ENV === 'dev'`) — returns:

  * `statusCode`
  * `timestamp`
  * `request path`
  * `error message`
* In **production** (`NODE_ENV === 'prod'`) — returns only:

  * `statusCode`

---

## 📁 File

```bash
src/common/filters/http-exception.filter.ts
```

---

## 🧱 Code

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line n/no-extraneous-import
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const isDev = this.configService.get<string>('NODE_ENV') === 'dev';
    const isProd = this.configService.get<string>('NODE_ENV') === 'prod';

    if (isDev) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    }

    if (isProd) {
      response.status(status).json({
        statusCode: status,
      });
    }
  }
}
```

---

## 🛠 Usage

### In `main.ts`:

```ts
const app = await NestFactory.create(AppModule);
const configService = app.get(ConfigService);

app.useGlobalFilters(new HttpExceptionFilter(configService));
```

---

## ✅ Notes

- Requires `ConfigModule.forRoot({ isGlobal: true })`
- Works only for `HttpException` subclasses (e.g. `BadRequestException`)
