import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Logger,
  Query,
  Version,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }
  @Get('/token')
  @Version('2')
  async getCacheTest(@Query('token') token): Promise<any> {
    this.logger.log('token:', token);
    const res = await this.cacheManager.get('token');
    await this.cacheManager.set('token', token || 'default token');
    return {
      token: res,
    };
  }
}
