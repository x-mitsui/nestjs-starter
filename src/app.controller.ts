import { MailerService } from '@nestjs-modules/mailer';
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
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }
  @Get('/token')
  @Version('1')
  async getCacheTest(@Query('token') token): Promise<any> {
    this.logger.log('token:', token);
    const res = await this.cacheManager.get('token');
    await this.cacheManager.set('token', token || 'default token');
    return {
      token: res,
    };
  }

  @Get('mail')
  @Version('1')
  async sendMail(@Query('token') token): Promise<any> {
    this.mailerService
      .sendMail({
        to: 'x_mitsui@163.com',
        from: '1396586682@qq.com',
        template: 'welcome',
        context: {
          name: 'dzq',
        },
      })
      .then((res) => {
        this.logger.log('send mail successfully!');
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }
}
