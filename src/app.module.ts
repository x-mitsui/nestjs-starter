import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { ConfigModule } from '@/common/config/config/config.module';
import { LogsModule } from '@/common/logger/logs.module';
import { MailModule } from '@/common/mail/mail.module';

@Module({
  imports: [ConfigModule, LogsModule, MailModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
