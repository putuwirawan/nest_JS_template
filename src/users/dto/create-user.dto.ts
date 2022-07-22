import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { UniqueUserValidator } from '../unique.user.validator';
//import { UniqueValidator } from '../unique.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Katul', description: 'Not empty' })
  @IsNotEmpty()
  @Validate(UniqueUserValidator)
  name: string;

  @ApiProperty({ example: 'ajus@katul.com', description: 'use valid email' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueUserValidator)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '123456', description: 'min 6 chharacter length' })
  password: string;
}
