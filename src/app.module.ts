import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import appConfig from './shared/config/app.config';
import { AllExceptionsFilter } from './shared/filter/all-exception-filter';
import { envSchema } from './shared/validation/env.schema';

const logger = new Logger('ConfigModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            console.error(`→ ${issue.path.join('.')}: ${issue.message}`);
          }
          logger.error('Env validation error:');
          throw new Error('Environment validation failed');
        }
        logger.log('Env validation passed');
        return parsed.data;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
