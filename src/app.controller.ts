/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import { Controller, Get, HttpException } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    throw new HttpException('123', 500);
    return this.appService.getHello();
  }
}
