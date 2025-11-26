import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // 替代nestjs自带的日志
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  const errorFilterFlag = configService.get<string>('ERROR_FILTER', 'false');
  if (errorFilterFlag === 'true') {
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter)); // 全局的错误过滤器
  }

  const cors = configService.get<string>('CORS', 'false');
  if (cors === 'true') {
    app.enableCors();
  }

  const prefix = configService.get<string>('PREFIX', '/api');
  const versionStr = configService.get<string>('VERSION', '1');
  let version = [versionStr];
  if (versionStr.indexOf(',')) {
    version = versionStr.split(',');
  }

  // 期望：http://localhost:3000/api/v1/hello
  // docs: https://docs.nestjs.cn/techniques/versioning
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: versionStr === undefined ? VERSION_NEUTRAL : version, // 如果VERSION_NEUTRAL，那么加不加v1或v2都无所谓了，接口均能被访问
  });

  await app.listen(port);
}

bootstrap();
