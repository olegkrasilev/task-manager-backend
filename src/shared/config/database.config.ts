import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppConfig } from './app.config';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const env = config.get<AppConfig>('appConfig');

  if (!env) {
    throw new Error('Missing appConfig');
  }

  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    autoLoadEntities: true,
    synchronize: env.NODE_ENV === 'prod' ? false : true,
    logging: true,
    logger: 'advanced-console',
  };
};
