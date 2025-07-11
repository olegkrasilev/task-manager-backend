import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

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

  if (!appConfig) {
    logger.error(`Error loading app config`);
    throw new Error('Error loading app config');
  }
  logger.log(`PORT = ${appConfig.PORT}`);
  logger.log(`NODE_ENV = ${appConfig.NODE_ENV}`);
  await app.listen(appConfig.PORT);
}

void bootstrap();
