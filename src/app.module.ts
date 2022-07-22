import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.dev.env', isGlobal: true }),
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(process.env.MONGGODB_CONNECTION),
   // ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService,CronService],//[AppService,CronService]
})
export class AppModule {}
