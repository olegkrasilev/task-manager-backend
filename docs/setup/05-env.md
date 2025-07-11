---
# 📘 NestJS Environment Configuration with Zod

This guide describes how to validate and use environment variables in a NestJS application using `@nestjs/config` and `zod`.
---

## ✅ Step 1. Install dependencies

```bash
npm install @nestjs/config zod cross-env
```

---

## 📂 Folder structure

```
src/
├── shared/
│   ├── config/
│   │   └── app.config.ts
│   └── validation/
│       └── env.schema.ts
```

---

## 🧩 env.schema.ts — define and validate variables

```ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), { message: 'PORT must be a number' }),
});
```

---

## ⚙️ app.config.ts — load config and validate

```ts
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { envSchema } from '../validation/env.schema';

export type AppConfig = z.infer<typeof envSchema>;

export default registerAs('app', (): AppConfig => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables');
    for (const issue of parsed.error.issues) {
      console.error(`→ ${issue.path.join('.')}: ${issue.message}`);
    }
    throw new Error('Environment validation failed');
  }

  return parsed.data;
});
```

---

## 🧩 app.module.ts — plug in ConfigModule

```ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './shared/config/app.config';
import { envSchema } from './shared/validation/env.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const logger = new Logger('ConfigModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      load: [appConfig],
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            console.error(`→ ${issue.path.join('.')}: ${issue.message}`);
          }
          logger.error('Env validation error');
          throw new Error('Environment validation failed');
        }
        logger.log('Env validation passed');
        return parsed.data;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 🚀 main.ts — access config at runtime

```ts
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppConfig } from './shared/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  if (!appConfig) {
    logger.error('Error loading app config');
    throw new Error('Error loading app config');
  }

  logger.log(`PORT = ${appConfig.PORT}`);
  logger.log(`NODE_ENV = ${appConfig.NODE_ENV}`);
  await app.listen(appConfig.PORT);
}

void bootstrap();
```

---

## 📦 package.json — environment presets

```json
"scripts": {
  "start": "cross-env NODE_ENV=prod nest start",
  "start:dev": "cross-env NODE_ENV=dev nest start --watch",
  "start:debug": "cross-env NODE_ENV=dev nest start --debug --watch",
  "start:prod": "cross-env NODE_ENV=prod node dist/main.js"
}
```

---

## 📝 Notes

- `.env.dev` and `.env.prod` files are used based on `NODE_ENV`
- `zod` provides schema validation and error messages
- `registerAs('app', ...)` allows you to namespace your configs (`'app'`)
- Validation errors show **exactly which variable failed** and **why**

---

## 🧪 Example .env.dev

```
NODE_ENV=dev
PORT=3000
```

---
