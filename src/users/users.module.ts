import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { UniqueUserValidator } from './unique.user.validator';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSchema } from 'src/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { SessionSerializer } from 'src/auth/session.serializer';
import { AuthService } from 'src/auth/__mocks__/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.dev.env', isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWTSECRETKEY,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UniqueUserValidator],
  exports: [UsersService],
})
export class UsersModule {}
//LocalStrategy,SessionSerializer,JwtStrategy
