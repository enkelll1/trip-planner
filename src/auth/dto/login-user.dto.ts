import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'youremail@gmail.com',
    required: true,
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'yourpass',
    required: true,
  })
  password: string;
}
