import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// eslint-disable-next-line n/no-extraneous-import
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './shared/config/app.config';
import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptor/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  const loggerService = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));
  app.use(helmet());
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: true, limit: '100kb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  if (!appConfig) {
    logger.error(`Error loading app config`);
    throw new Error('Error loading app config');
  }
  logger.log(`PORT = ${appConfig.PORT}`);
  logger.log(`NODE_ENV = ${appConfig.NODE_ENV}`);
  await app.listen(appConfig.PORT);
}

void bootstrap();
