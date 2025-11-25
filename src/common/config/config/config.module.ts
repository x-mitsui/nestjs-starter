import { Module } from '@nestjs/common';
import { ConfigModule as Config, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';

const envFilePath = [`.env.${process.env.NODE_ENV || 'development'}`, '.env'];
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().ip(),
});

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema: schema,
    }),
    CacheModule.registerAsync({
      imports: [Config], // 引入 ConfigModule
      inject: [ConfigService], // 注入 ConfigService
      useFactory: async (configService: ConfigService) => {
        const redisURL = configService.get<string>('REDIS_URL');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const cacheTtl = configService.get<number>('CACHE_TTL');

        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: cacheTtl,
                lruSize: 5000,
              }),
            }),
            createKeyv({
              url: redisURL,
              password: redisPassword,
            }),
          ],
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class ConfigModule {}
