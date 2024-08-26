import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'yourusername',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'youremail@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'yourpass',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'yourpass',
    required: true,
  })
  @IsString()
  repeatPassword: string;
}
