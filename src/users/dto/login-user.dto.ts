import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';


export class LoginUserDto {
  @ApiProperty({ example: 'ajus@katul.com', description: 'use valid email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ example: '1234', description: 'min 4 chharacter length' })
  password: string;
}
