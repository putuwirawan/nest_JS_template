import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
@ApiTags('User')

// @ApiExcludeController()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('/signup')
  async signupUser(@Body() params: CreateUserDto): Promise<User> {
    const isDuplicated = await this.usersService.duplicatedUser(params);

    if (!isDuplicated) return this.usersService.create(params);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Body() params: LoginUserDto): Promise<any> {
    let user: any;

    try {
      user = await this.usersService.findByLogin({
        email: params.email,
        password: params.password,
      });
    } catch (error) {
      throw new HttpException(
        ` ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const token = this.jwtService.sign({ email: user.email, id: user._id });
    return { access_token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() params: CreateUserDto): Promise<User> {
    let isDuplicated: boolean;
    isDuplicated = await this.usersService.duplicatedUser(params);

    if (!isDuplicated) return this.usersService.create(params);
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthenticatedGuard)
  @Get()
  @ApiBearerAuth()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  updateById(
    @Param('id') id: string,
    @Body() update: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateById(id, update);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  removeById(@Param('id') id: string): Promise<User> {
    return this.usersService.removeById(id);
  }
}
