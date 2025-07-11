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
    const infoTransport = new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'info'),
      filename: '%DATE%',
      datePattern: 'YYYY/MM/DD',
      maxFiles: '14d',
      zippedArchive: false,
      level: 'info',
    });

    const errorTransport = new winston.transports.DailyRotateFile({
      dirname: path.join('logs', 'errors'),
      filename: '%DATE%',
      datePattern: 'YYYY/MM/DD',
      maxFiles: '30d',
      zippedArchive: false,
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
        infoTransport,
        errorTransport,
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

  error<T>(message: T) {
    this.logger.error(message);
  }
}
