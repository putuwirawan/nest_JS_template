import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enum/users.enum';



export class UpdateUserDto {
  @ApiProperty({ example: 'Katul', description: 'Not empty' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'ajus@katul.com', description: 'use valid email' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '1234', description: 'min 4 chharacter length' })
  @IsOptional()
  password?: string;

  @IsEnum(UserStatus)
  @IsOptional() 
  @ApiProperty({
    example: 'user',
    description: ' enum :user,admin'
  })
  role?: UserStatus 
}

