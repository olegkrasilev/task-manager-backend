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
