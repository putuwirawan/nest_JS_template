import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import * as session from "express-session"
import * as passport from "passport"

// require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mongo TDD master')
    .setDescription('mongoDb Tdd API test')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // const document = SwaggerModule.createDocument(app, config,{include:[UsersModule]});
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(
    session({
      secret: "keyboard",
      resave: false,
      saveUninitialized: false,
    }))

  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(3000);
}
bootstrap();


