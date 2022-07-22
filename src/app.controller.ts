import { Controller, Request, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

import { LoginUserDto } from './users/dto/login-user.dto';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}


  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
